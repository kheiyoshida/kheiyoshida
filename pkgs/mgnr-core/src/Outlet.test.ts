import { Outlet, OutletPort } from './Outlet'
import { createGenerator } from './commands'
import { Middlewares, SequenceGenerator } from './Generator'

class MockInst {
  triggerNote(...args: unknown[]) {}
}

class MockOutlet extends Outlet<MockInst> {
  sendNote(...args: unknown[]): void {
    this.inst.triggerNote(...args)
  }
  assignGenerator<GMW extends Middlewares>(generator: SequenceGenerator<GMW>) {
    return new MockOutletPort(this, generator)
  }
}

class MockOutletPort<GMW extends Middlewares> extends OutletPort<MockOutlet, GMW> {
  public loopSequence() {
    this.outlet.sendNote('note')
    return this
  }
}

describe(`${Outlet.name}`, () => {
  it(`can emit a port per generator that can send note back to the outlet instrument`, () => {
    const inst = new MockInst()
    const instTriggerNote = jest.spyOn(inst, 'triggerNote')
    const outlet = new MockOutlet(inst)
    outlet.assignGenerator(createGenerator({})).loopSequence()
    expect(instTriggerNote).toHaveBeenCalledWith('note')
  })
})
