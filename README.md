
# midicontrols

[![Build Status](https://travis-ci.org/jupyter-widgets/midicontrols.svg?branch=master)](https://travis-ci.org/jupyter-widgets/ipymidicontrols)
[![codecov](https://codecov.io/gh/jupyter-widgets/midicontrols/branch/master/graph/badge.svg)](https://codecov.io/gh/jupyter-widgets/midicontrols)


A Jupyter widget for interfacing with MIDI controllers.

## Installation

You can install using `pip`:

```bash
pip install ipymidicontrols
```

Or if you use jupyterlab:

```bash
pip install ipymidicontrols
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] ipymidicontrols
```

## Usage

Create a controller widget for a [Behringer XTouch Mini](https://www.musictribe.com/Categories/Behringer/Computer-Audio/Desktop-Controllers/X-TOUCH-MINI/p/P0B3M):

```python
from ipymidicontrols import XTouchMini
x = XTouchMini()
```

See a simple widgets-based UI for the controls:

```python
from ipymidicontrols import xtouchmini_ui
xtouchmini_ui(x)
```

![screenshot](https://raw.githubusercontent.com/jupyter-widgets/midicontrols/master/XTouchMini.png)
