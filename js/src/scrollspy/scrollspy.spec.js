import ScrollSpy from './scrollspy'
import Manipulator from '../dom/manipulator'
import EventHandler from '../dom/event-handler'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('ScrollSpy', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    fixtureEl.style.display = 'none'
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(ScrollSpy.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(ScrollSpy.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('constructor', () => {
    it('should only switch "active" class on current target', done => {
      fixtureEl.innerHTML = [
        '<div id="root" class="active" style="display: block">',
        '  <div class="topbar">',
        '    <div class="topbar-inner">',
        '      <div class="container" id="ss-target">',
        '        <ul class="nav">',
        '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
        '          <li class="nav-item"><a href="#detail">Detail</a></li>',
        '        </ul>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
        '    <div style="height: 200px;">',
        '      <h4 id="masthead">Overview</h4>',
        '      <p style="height: 200px;"></p>',
        '    </div>',
        '    <div style="height: 200px;">',
        '      <h4 id="detail">Detail</h4>',
        '      <p style="height: 200px;"></p>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
      const rootEl = fixtureEl.querySelector('#root')
      const scrollSpy = new ScrollSpy(scrollSpyEl, {
        target: 'ss-target'
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      scrollSpyEl.addEventListener('scroll', () => {
        expect(rootEl.classList.contains('active')).toEqual(true)
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      })

      fixtureEl.style.display = 'block'
      scrollSpyEl.scrollTop = 350
    })

    it('should only switch "active" class on current target specified w element', done => {
      fixtureEl.innerHTML = [
        '<div id="root" class="active" style="display: block">',
        '  <div class="topbar">',
        '    <div class="topbar-inner">',
        '      <div class="container" id="ss-target">',
        '        <ul class="nav">',
        '          <li class="nav-item"><a href="#masthead">Overview</a></li>',
        '          <li class="nav-item"><a href="#detail">Detail</a></li>',
        '        </ul>',
        '      </div>',
        '    </div>',
        '  </div>',
        '  <div id="scrollspy-example" style="height: 100px; overflow: auto;">',
        '    <div style="height: 200px;">',
        '      <h4 id="masthead">Overview</h4>',
        '      <p style="height: 200px;"></p>',
        '    </div>',
        '    <div style="height: 200px;">',
        '      <h4 id="detail">Detail</h4>',
        '      <p style="height: 200px;"></p>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('')

      const scrollSpyEl = fixtureEl.querySelector('#scrollspy-example')
      const rootEl = fixtureEl.querySelector('#root')
      const scrollSpy = new ScrollSpy(scrollSpyEl, {
        target: fixtureEl.querySelector('#ss-target')
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      scrollSpyEl.addEventListener('scroll', () => {
        expect(rootEl.classList.contains('active')).toEqual(true)
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      })

      fixtureEl.style.display = 'block'
      scrollSpyEl.scrollTop = 350
    })

    it('should correctly select middle navigation option when large offset is used', done => {
      fixtureEl.innerHTML = [
        '<div id="header" style="height: 500px;"></div>',
        '<nav id="navigation" class="navbar">',
        ' <ul class="navbar-nav">',
        '   <li class="nav-item active"><a class="nav-link" id="one-link" href="#one">One</a></li>',
        '   <li class="nav-item"><a class="nav-link" id="two-link" href="#two">Two</a></li>',
        '   <li class="nav-item"><a class="nav-link" id="three-link" href="#three">Three</a></li>',
        ' </ul>',
        '</nav>',
        '<div id="content" style="height: 200px; overflow-y: auto;">',
        ' <div id="one" style="height: 500px;"></div>',
        ' <div id="two" style="height: 300px;"></div>',
        ' <div id="three" style="height: 10px;"></div>',
        '</div>'
      ].join('')

      fixtureEl.style.display = 'block'
      const contentEl = fixtureEl.querySelector('#content')
      const scrollSpy = new ScrollSpy(contentEl, {
        target: '#navigation',
        offset: Manipulator.position(contentEl).top
      })

      spyOn(scrollSpy, '_process').and.callThrough()

      contentEl.addEventListener('scroll', () => {
        expect(fixtureEl.querySelector('#one-link').classList.contains('active')).toEqual(false)
        expect(fixtureEl.querySelector('#two-link').classList.contains('active')).toEqual(true)
        expect(fixtureEl.querySelector('#three-link').classList.contains('active')).toEqual(false)
        expect(scrollSpy._process).toHaveBeenCalled()
        done()
      })

      contentEl.scrollTop = 550
    })

    it('should add the active class to the correct element', done => {
      fixtureEl.innerHTML = [
        '<nav class="navbar">',
        '  <ul class="nav">',
        '    <li class="nav-item"><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>',
        '    <li class="nav-item"><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>',
        '  </ul>',
        '</nav>',
        '<div class="content" style="overflow: auto; height: 50px">',
        '  <div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>',
        '  <div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>',
        '</div>'
      ].join('')

      fixtureEl.style.display = 'block'
      const contentEl = fixtureEl.querySelector('.content')
      const scrollSpy = new ScrollSpy(contentEl, {
        offset: 0,
        target: '.navbar'
      })
      const spy = spyOn(scrollSpy, '_process').and.callThrough()
      const testElementIsActiveAfterScroll = (elementSelector, targetSelector, cb) => {
        const element = fixtureEl.querySelector(elementSelector)
        const target = fixtureEl.querySelector(targetSelector)

        // add top padding to fix Chrome on Android failures
        const paddingTop = 5
        const scrollHeight = Math.ceil(contentEl.scrollTop + Manipulator.position(target).top) + paddingTop

        function listener() {
          expect(element.classList.contains('active')).toEqual(true)
          contentEl.removeEventListener('scroll', listener)
          expect(scrollSpy._process).toHaveBeenCalled()
          spy.calls.reset()
          cb()
        }

        contentEl.addEventListener('scroll', listener)
        contentEl.scrollTop = scrollHeight
      }

      testElementIsActiveAfterScroll('#a-1', '#div-1', () => {
        testElementIsActiveAfterScroll('#a-2', '#div-2', () => done())
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a scrollspy', () => {
      spyOn(EventHandler, 'off')

      const scrollSpy = new ScrollSpy(fixtureEl)

      scrollSpy.dispose()
      expect(EventHandler.off).toHaveBeenCalledWith(fixtureEl, '.bs.scrollspy')
    })
  })
})
