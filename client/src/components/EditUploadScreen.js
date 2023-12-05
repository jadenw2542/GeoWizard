import React from "react";
import PropTypes from 'prop-types';
import { useState, useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { MapContext, MapActionType } from "../api/MapContext"
import { simplify } from '@turf/turf'
import { UserContext } from "../api/UserContext";
import france from "../assets/EditMapAssets/france.png"
import ireland from "../assets/EditMapAssets/ireland.png"
import finland from "../assets/EditMapAssets/finland.png"
import poland from "../assets/EditMapAssets/poland.png"

import franceGeoJson from '../assets/EditMapAssets/france-compress.geo.json';
import irelandGeoJson from '../assets/EditMapAssets/ireland-compress.geo.json';
import polandGeoJson from '../assets/EditMapAssets/poland-compress.geo.json';
import finlandGeoJson from '../assets/EditMapAssets/finland-compress.geo.json';
import index from "function.prototype.name";

import toGeoJSON from '@mapbox/togeojson';
import L from 'leaflet';
import { truncate } from "lodash";
import { feature } from "caniuse-lite";
/* global shp */

const DisplayMap = (props) => {
    const { dispatch } = useContext(MapContext)
    const navigate = useNavigate();
    const index = props.index
    const mapArr = props.arr
    const countryNames = ["France", "Ireland", "Finland", "Poland"]//To be changed
    const editClassName = countryNames[index]
    // const handleEditClick = () => {
    //     navigate('/editingmap')   //For now brings you back to / change later
    // }
    const handleExistingMapsClick = (countryName) => {
        dispatch({ type: MapActionType.RESET })
        let selected_file = null
        switch (countryName) {
            case 'France':
                selected_file = franceGeoJson
                break;
            case 'Ireland':
                selected_file = irelandGeoJson
                break;
            case 'Finland':
                selected_file = finlandGeoJson
                break;
            case 'Poland':
                selected_file = polandGeoJson
                break;
            default:
                console.log("No map found")
                break;
        }
        const edited = {
            type: selected_file.type,
            features: selected_file.features.map((feature, index) => ({
                ...feature,
                key: index,
            })),
        }
        dispatch({ type: MapActionType.VIEW, payload: edited })
        navigate('/editingMap')   //For now brings you back to / change later
    }
    return (
        <>
            <div className="h-full">
                <div className="bg-primary-GeoOrange text-center rounded-lg ">
                    <img src={mapArr[index]} className="h-64 w-[28rem] rounded-lg" />
                    <div className={editClassName} onClick={() => handleExistingMapsClick(countryNames[index])}>Edit {" " + countryNames[index]}</div>
                </div>
            </div>
        </>
    )
}

DisplayMap.propTypes = {
    index: PropTypes.number.isRequired,
    arr: PropTypes.array.isRequired
};

const EditUpload = () => {
    const { user } = useContext(UserContext)
    const inputRef = useRef(null);
    const { dispatch } = useContext(MapContext)
    const [mapIndex, setIndex] = useState(0); // index of mapArr
    const [mapArrayObj,] = useState([france, ireland, finland, poland]); // index of mapArr For now will just be array of imagepaths
    const [mapErrorMessage, setMapErrorMessage] = useState(false)

    const navigate = useNavigate();
    const arrowOnclick = (direction) => {
        if (direction === 0)  //0 is left
        {
            if (mapIndex === 0)//from begining
                setIndex(mapArrayObj.length - 2)
            else
                setIndex(mapIndex - 2)
        }
        else  //moving right
        {
            if ((mapIndex + 2) === mapArrayObj.length)//from end
                setIndex(0)
            else
                setIndex(mapIndex + 2)
        }
    }
    const uploadHandle = () => {
        inputRef.current.click();
    }
    const handleFileChange = (event) => {         //TODO parse file uploaded and move on to edit map setContext
        const selected_file = event.target.files[0]
        const file_type = selected_file.name.split('.').pop().toLowerCase()
        console.log(file_type)
        const options = { tolerance: 0.01, highQuality: true }
        const reader = new FileReader()
        const parser = new DOMParser();
        const JSZip = require('jszip');

        switch (file_type) {
            case 'zip':
                reader.onload = async (e) => {
                    try {
                        const zipBuffer = e.target.result;
                        const zip = await JSZip.loadAsync(zipBuffer);
                        const files = Object.keys(zip.files);
                        const hasShp = files.some(f => f.endsWith('.shp'));
                        const hasShx = files.some(f => f.endsWith('.shx'));
                        const hasDbf = files.some(f => f.endsWith('.dbf'));

                        if (!hasShp || !hasShx || !hasDbf) {
                            console.error("Invalid zip file: required shapefile components (.shp, .shx, .dbf) not found");
                            setMapErrorMessage(true);
                            return;
                        }

                        const geojsonArray = await shp(zipBuffer);
                        const compressedArray = geojsonArray.map(geojson => {
                            if (geojson.type === 'FeatureCollection') {
                                return {
                                    ...geojson,
                                    features: geojson.features.map(feature => simplify(feature, options))
                                };
                            }
                            return geojson;
                        });

                        const compressed = compressedArray[0];
                        const edited = {
                            type: compressed.type,
                            features: compressed.features.map((feature, index) => ({
                                ...feature,
                                key: index,
                            })),
                        };
                        // console.log("Upload",edited)
                        dispatch({ type: MapActionType.UPLOAD, payload: edited });
                        navigate('/editingMap');
                    } catch (error) {
                        console.error("Error processing zip file:", error);
                        // Handle error here
                    }
                };
                reader.readAsArrayBuffer(selected_file);
                break;
            case 'json':
                reader.onload = (e) => {
                    const geojson = JSON.parse(e.target.result)//REMEMBER TO COMPRESS AFTER HANDLING OTHER FILE FORMATS
                    const compressed = simplify(geojson, options);
                    const edited = {
                        type: compressed.type,
                        features: compressed.features.map((feature, index) => ({
                            ...feature,
                            key: index,
                        })),
                    }
                    dispatch({ type: MapActionType.UPLOAD, payload: edited })
                }

                dispatch({ type: MapActionType.RESET })
                reader.readAsText(selected_file)
                navigate('/editingMap')   //For now brings you back to / change later
                break
            case 'kml':
                reader.onload = (e) => {
                    const kmlDocument = parser.parseFromString(e.target.result, "text/xml");
                    const geojson = toGeoJSON.kml(kmlDocument);
                    const compressed = simplify(geojson, options);
                    const edited = {
                        type: compressed.type,
                        features: compressed.features.map((feature, index) => ({
                            ...feature,
                            properties: {
                                ...feature.properties,
                                iconUrl: feature.properties.icon, // Store the icon URL
                            },
                            key: index,
                        })),
                    };
                    dispatch({ type: MapActionType.UPLOAD, payload: edited });
                };

                dispatch({ type: MapActionType.RESET });
                reader.readAsText(selected_file);
                navigate('/editingMap');
                break;
            case 'geowizjson': //custum format similar to geojson
                reader.onload = (e) => {
                    const wizjson = JSON.parse(e.target.result)
                    // console.log("whats uploaded",wizjson)
                    const edited = {
                        features: [...wizjson.features],
                        description: wizjson.description,
                        edits: { ...wizjson.edits },
                        title: wizjson.title
                    }
                    console.log("this is wat got dispactached", edited)
                    dispatch({ type: MapActionType.UPLOAD, payload: edited })
                }
                reader.readAsText(selected_file)
                navigate('/editingMap')
                break
            default:
                setMapErrorMessage(true)
        }
    }
    return (
        <>
            <div className="bg-primary-GeoPurple min-h-screen max-h-screen overflow-auto">
                <div className="flex justify-center pl-8 md:pl-10 lg:pl-20 xl:pl-40 pr-8 md:pr-10 lg:pr-20 xl:pr-40">
                    <div className="flex flex-col">
                        <div className="flex justify-between pt-10 ">
                            <div className=" text-primary-GeoBlue font-NanumSquareNeoOTF-Bd">
                                <h3 className="text-3xl pb-5">Start Editing Maps by uploading our supported map formats :</h3>
                                <ul className="list-disc pl-5 ">
                                    <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoJson</li>
                                    <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">KML</li>
                                    <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">SHP and DBFS upload as zip</li>
                                    <li className="text-xl font-NanumSquareNeoOTF-Lt mb-5">GeoWizJson</li>
                                </ul>
                            </div>
                            <div className=" pt-20 ">
                                <input className="hidden" type="file" accept=".zip, .json, .kml, .shp, .geowizjson" ref={inputRef} onChange={handleFileChange} />
                                <div className="group flex relative">
                                    <button data-test-id="upload-button" className="bg-primary-GeoOrange px-16 rounded-full py-2 disabled:opacity-30" onClick={() => uploadHandle()} disabled={!user}>
                                        Upload
                                    </button>
                                    {!user && <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 whitespace-nowrap rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">You must be logged in to upload a map</span>}
                                </div>

                                {mapErrorMessage ?
                                    <div style={{ color: '#8B0000', textAlign: 'center' }}> Please upload a supported format </div>
                                    : null}
                            </div>
                        </div>
                        <div className="flex flex-col pt-16">
                            <div className="text-3xl font-NanumSquareNeoOTF-Bd">
                                OR
                            </div>

                            <div className=" text-xl pt-10 font-NanumSquareNeoOTF-Lt  text-primary-GeoBlue">
                                Start From a Selection of Existing Maps
                            </div>
                            <div className="flex flex-row justify-around pt-10 items-center" >
                                <div className="w-20 h-20 rounded-full border border-opacity-100 border-black bg-primary-GeoBlue
                                text-center text-3xl flex justify-center items-center mt-12 font-extrabold"
                                    onClick={() => arrowOnclick(0)}>
                                    ←
                                </div>
                                <DisplayMap {...{ index: mapIndex, arr: mapArrayObj }} />
                                <DisplayMap {...{ index: mapIndex + 1, arr: mapArrayObj }} />
                                <div className="w-20 h-20 rounded-full border border-opacity-100 border-black bg-primary-GeoBlue
                                text-center text-3xl flex justify-center items-center mt-12 font-extrabold"
                                    onClick={() => arrowOnclick(1)}>
                                    →
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default EditUpload
