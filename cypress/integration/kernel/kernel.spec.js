/// <reference types="cypress" />
/* global before, cy, describe, it */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai')

const testValue = Math.random()

describe('Kernel', () => {
  before(() => {
    cy.visit('https://localhost:2160')
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

  it('should create directory', async () => {
    const { kernel } = await cy.window()
    kernel.fs.mkdirSync('/tmp/test')
    expect(kernel.fs.existsSync('/tmp/test')).to.be.true
  })

  it('should create file', async () => {
    const { kernel } = await cy.window()
    kernel.fs.writeFileSync('/tmp/test/test.txt', testValue.toString(), 'utf8')
    expect(kernel.fs.readFileSync('/tmp/test/test.txt').toString()).to.equal(testValue.toString())
  })

  it('should delete a file', async () => {
    const { kernel } = await cy.window()
    kernel.fs.unlinkSync('/tmp/test/test.txt')
    expect(kernel.fs.existsSync('/tmp/test/test.txt')).to.be.false
  })

  it('should delete a directory', async () => {
    const { kernel } = await cy.window()
    kernel.fs.rmdirSync('/tmp/test')
    expect(kernel.fs.existsSync('/tmp/test')).to.be.false
  })
})
