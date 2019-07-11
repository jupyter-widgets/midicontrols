#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Project Jupyter Contributors
# Distributed under the terms of the Modified BSD License.

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'nbextension/static',
        'dest': 'ipymidicontrols',
        'require': '@jupyter-widgets/midicontrols/extension'
    }]
