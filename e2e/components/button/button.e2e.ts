import {browser, by, element} from 'protractor';
import {screenshot} from '../../screenshot';

describe('button', function () {
  describe('disabling behavior', function () {
    beforeEach(function() {
      browser.get('/button');
    });
    it('should prevent click handlers from executing when disabled', function () {
      let testname =
        `button disabling behavior should prevent click handlers from executing when disabled`;
      screenshot(testname);
      element(by.id('test-button')).click();
      expect(element(by.id('click-counter')).getText()).toEqual('1');
      screenshot(testname + ' click once');

      element(by.id('disable-toggle')).click();
      element(by.id('test-button')).click();
      expect(element(by.id('click-counter')).getText()).toEqual('1');
      screenshot(testname + 'click disabled');
    });
  });
});
