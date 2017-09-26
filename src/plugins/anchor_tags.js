/*jshint esversion: 6 */

/**
 * This plugin attempts to rectify the common problem that igraweb breaks
 * expected anchor tag functionality. Namely that replacing the window 
 * location with a url that has a hash (e.g. /path#anchor), will not scroll
 * the window to the <a name="anchor"></a> anchor because it will be loaded
 * later.
 */

import igraweb from '../index';

const { navigator } = igraweb.utils.router;

document.addEventListener('igrawebContentLoaded', () => {
  const hash = navigator.hash();

  if (!hash) { return; }

  const name = hash.replace(/^\#/g, '');
  const element = document.querySelector(`#${name}, [name="${name}"]`);

  if (!element) { return; }

  element.scrollIntoView();
});
