/// <reference types="cypress" />
/* global before, cy, describe, it */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai')

describe('modules/account', () => {
  before(() => {
    cy.setupMetamask()
    cy.changeMetamaskNetwork('localhost')
    cy.visit('https://localhost:2160')
  })

  it('should connect to an account', async () => {
    const { kernel } = await cy.window()
    await kernel.modules.account.connect()
    expect(kernel.modules.account.address).to.exist
  })
})
