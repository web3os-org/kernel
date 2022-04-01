/// <reference types="cypress" />

const { expect } = require('chai')

const testValue = Math.random()

describe('Kernel', () => {
  before(() => {
    cy.visit('https://localhost:8080')
  })

  it('should boot to a prompt', () => {
    cy.get('.xterm-screen').should('exist')
  })

  it('should store a value', () => {
    cy.get('.xterm-screen').type(`set test value ${testValue}\n`)
  })

  it('should get the same value', async () => {
    const { kernel } = await cy.window()
    const val = kernel.get('test', 'value')
    expect(parseFloat(val)).to.equal(testValue)
  })
})
