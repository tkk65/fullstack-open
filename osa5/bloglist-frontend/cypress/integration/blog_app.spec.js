describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Cypress',
      username: 'cypress',
      password: 'cypress'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('cypress')
      cy.get('#login-button').click()

      cy.contains('Cypress logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error-notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'cypress', password: 'cypress' })
      })

      it('A blog can be created', function () {
        cy.get('#new-blog-button').click()
        cy.get('#title').type('title')
        cy.get('#author').type('author')
        cy.get('#url').type('http://url.url')
        cy.get('#submit').click()

        cy.get('.header').contains('title author')
      })

      describe('and a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'title',
            author: 'author',
            url: 'http://url.url'
          })
        })

        it('clicking like button updates likes count', function () {
          cy.get('.view-button').click()
          cy.get('.likes').contains('likes 0')
          cy.get('.like-button').click()
          cy.get('.likes').contains('likes 1')
        })
      })

      describe('and several users and blogs exists', function () {
        beforeEach(function () {
          cy.request('POST', 'http://localhost:3001/api/testing/reset')
          const user1 = {
            name: 'User 1',
            username: 'user1',
            password: '1234'
          }
          cy.request('POST', 'http://localhost:3001/api/users/', user1)
          const user2 = {
            name: 'User 2',
            username: 'user2',
            password: '1234'
          }
          cy.request('POST', 'http://localhost:3001/api/users/', user2)

          cy.login({ username: 'user2', password: '1234' })
          cy.createBlog({
            title: 'title 2',
            author: 'author 2',
            url: 'http://url2.url'
          })

          cy.login({ username: 'user1', password: '1234' })
          cy.createBlog({
            title: 'title 1',
            author: 'author 1',
            url: 'http://url1.url'
          })

          cy.visit('http://localhost:3000')
        })

        it('if logged person is blog creator blog can be removed', function () {
          cy.get('.header').should('have.length', 2)
          cy.contains('div', 'title 1 author 1').contains('view').click()
          cy.get('.remove-button').click()
          cy.get('.header').should('have.length', 1)
        })

        it('if logged person is not blog creator blog cannot be removed', function () {
          cy.get('.header').should('have.length', 2)
          cy.contains('div', 'title 2 author 2').contains('view').click()
          cy.get('.remove-button').should('have.length', 0)
        })
      })

      describe('and several blogs exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'title 1',
            author: 'author 1',
            url: 'http://url1.url',
            likes: 2
          })
          cy.createBlog({
            title: 'title 2',
            author: 'author 2',
            url: 'http://url2.url',
            likes: 1
          })
          cy.createBlog({
            title: 'title 3',
            author: 'author 3',
            url: 'http://url3.url',
            likes: 3
          })
          cy.visit('http://localhost:3000')
        })

        it('blogs are sorted by likes count', function () {
          cy.get('.header').should('have.length', 3)
          cy.get('.header').then(blogs => {
            cy.wrap(blogs[0]).should('contain', 'title 3 author 3')
            cy.wrap(blogs[1]).should('contain', 'title 1 author 1')
            cy.wrap(blogs[2]).should('contain', 'title 2 author 2')
          })
        })
      })
    })
  })
})
