import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import finland from "../../assets/finland.png"
import { MAP_TYPES, STRING_MAPPING } from '../../constants/MapTypes'
import { getMap } from '../../api/map_request_api'
import { MapContext, MapActionType } from '../../api/MapContext'
import { useNavigate } from "react-router-dom";
const ProfileMapCard = React.memo(({ map_data }) => {
    const { map, dispatch } = useContext(MapContext)
    const navigate = useNavigate()
    const getDatePosted = () => {
        const date = new Date(map_data?.createdAt);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year

        // Padding the month and day with leading zeros if necessary
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        return `${formattedMonth}/${formattedDay}/${year}`;
    }

    const handleViewMap = () => {
        const fetchMapData = async () => {
            try {
                const res = await getMap(map_data?._id)
                if (res) {
                    dispatch({ type: MapActionType.VIEW, payload: res });
                    navigate('/mapView')
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchMapData()
    }

    return (
        <li className='w-full flex justify-between bg-white shadow-sleek hover:bg-opacity-90 hover:cursor-pointer' id={map_data?._id} onClick={handleViewMap}>
            <div className='w-1/3'>
                <img src={finland} className='w-full h-full object-cover'></img>
            </div>
            <div className='flex flex-col justify-evenly text-center'>
                <p className='font-PyeongChangPeace-Bold text-lg'>{map_data?.title}</p>
                <p className='font-PyeongChangPeace-Light'>{`Published: ${map_data && getDatePosted()}`}</p>
                <p className='font-PyeongChangPeace-Light rounded-3xl bg-primary-GeoOrange'>{STRING_MAPPING[MAP_TYPES[map_data?.mapType]]}</p>
                <div className='flex justify-center items-center font-PyeongChangPeace-Light gap-1'>
                    <FontAwesomeIcon icon={faChartBar} />
                    {`${map_data?.comments.length} Comment${map_data?.comments.length ? 's' : ''}`}
                </div>
            </div>
            <div className='flex justify-center items-center font-PyeongChangPeace-Light mr-4 text-lg gap-2'>
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>{map_data?.likes}</p>
                {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
            </div>

        </li>
    )
})

export default ProfileMapCard