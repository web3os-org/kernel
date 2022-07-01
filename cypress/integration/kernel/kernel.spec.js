const { expect } = require('chai')

const testValue = Math.random()

describe('Kernel', () => {
  before(() => {
    cy.visit('https://localhost:30443')
  })

  it('should boot to a prompt', () => {
    cy.get('.xterm-screen').should('exist')
  })

  it('should store a value', () => {
    cy.get('.xterm-screen').type(`set test value ${testValue}\n`)
  })

  it('should get the same value', async () => {
    const { Kernel } = await cy.window()
    const val = Kernel.get('test', 'value')
    expect(parseFloat(val)).to.equal(testValue)
  })

  it('should create a directory', async () => {
    const { Kernel } = await cy.window()
    Kernel.fs.mkdirSync('/tmp/test')
    expect(Kernel.fs.existsSync('/tmp/test')).to.be.true
  })

  it('should create a file', async () => {
    const { Kernel } = await cy.window()
    Kernel.fs.writeFileSync('/tmp/test/test.txt', testValue.toString(), 'utf8')
    expect(Kernel.fs.readFileSync('/tmp/test/test.txt').toString()).to.equal(testValue.toString())
  })

  it('should delete a file', async () => {
    const { Kernel } = await cy.window()
    Kernel.fs.unlinkSync('/tmp/test/test.txt')
    expect(Kernel.fs.existsSync('/tmp/test/test.txt')).to.be.false
  })

  it('should delete a directory', async () => {
    const { Kernel } = await cy.window()
    Kernel.fs.rmdirSync('/tmp/test')
    expect(Kernel.fs.existsSync('/tmp/test')).to.be.false
  })
})
