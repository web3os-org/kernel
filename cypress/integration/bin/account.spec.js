/// <reference types="cypress" />
/* global before, cy, describe, it */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai')

describe('bin/account', () => {
  before(() => {
    cy.setupMetamask()
    cy.changeMetamaskNetwork('localhost')
    cy.visit('https://localhost:8080')
  })

  it('should connect to an account', async () => {
    const { kernel } = await cy.window()
    await kernel.bin.account.connect()
    expect(kernel.bin.account.address).to.exist
  })
})
