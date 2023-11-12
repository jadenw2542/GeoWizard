describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000') // change this later
  })
})

describe('testing RegisterScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register')
  })

  it('should display the registration form', () => {
    cy.get('h2').should('contain', 'Register')
    cy.get('form').should('exist')
  })

  it('should display an error message for password mismatch', () => {
    cy.get('input[name="password1"]').type('password123')
    cy.get('input[name="password2"]').type('differentpassword')
    cy.get('button[type="submit"]').click()
    cy.get('p').should('contain', "Passwords don't match")
  })
})

describe('LoginScreen Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('should exist', () => {
    cy.get('[data-test-id="login-div"]').should("exist")
  })
<<<<<<< HEAD

  it('should display a link to the registration page', () => {
    cy.get('a[href="/register"]').should('exist')
  })

  it('should display message for invalid login', () => {
    cy.get('input[name="email"]').type('dontexist@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-test-id="login-button"]').click()

    cy.get('pre').should('contain', JSON.stringify({ "message": "Invalid credentials" }, null, 2))
  })

  it('should display message for missing fields', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-test-id="login-button"]').click()
    cy.get('pre').should('contain', JSON.stringify({
      "message": "Missing required fields for login"
    }, null, 2))
  })

  it('should display message for invalid token', () => {
    cy.get('input[name="token"]').type('wrongtoken');
    cy.get('[data-test-id="user-button"]').click()
    cy.get('pre').should('contain', JSON.stringify({
      "message": "Not authorized, token failed"
    }, null, 2))
  })
})


describe('testing HomeScreen', () => {
  beforeEach(() => {
    cy.visit(HOST)
  })

  it('should display GeoWizard in Banner', () => {
    cy.get('span').should('contain', 'GeoWizard')
  })

  it('Should show dropdown when clicking time button', () => {
    cy.contains('Time').click()
    cy.get('a').should('contain', "Today")
  })

  it('should display in search bar', () => {
    cy.get('input').type('America').should('have.value', 'America')
  })


})
=======
})
>>>>>>> 08f3426a4bfd770fa65bc05380d5a9a4f6bd27b5
