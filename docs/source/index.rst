
ipymidicontrols
=====================================

Version: |release|

A Jupyter widget for interfacing with MIDI controllers.

Because Chrome is the only browser that implements the `Web MIDI API <https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess>`__, this package only works in Chrome. Firefox has `recent discussion <https://bugzilla.mozilla.org/show_bug.cgi?id=836897>`__ on how to move forward with implementing this standard. The webmidi JavaScript package mentions there is a Firefox plugin that possibly makes this work in Firefox (see `https://www.npmjs.com/package/webmidi#browser-support <https://www.npmjs.com/package/webmidi#browser-support>`__).

Each midi controller needs a custom implementation exposing the interface for that specific midi controller as buttons, knobs, faders, etc. Currently we support the `Behringer X-Touch Mini <https://www.behringer.com/Categories/Behringer/Computer-Audio/Desktop-Controllers/X-TOUCH-MINI/p/P0B3M#googtrans(en|en)>`__ controller, which is currently available for around $60.

.. toctree::
   :maxdepth: 2
   :caption: Installation and usage

   installing

.. toctree::
   :maxdepth: 1

   examples/index


.. toctree::
   :maxdepth: 2
   :caption: Development

   develop-install


.. links

.. _`Jupyter widgets`: https://jupyter.org/widgets.html

.. _`notebook`: https://jupyter-notebook.readthedocs.io/en/latest/
