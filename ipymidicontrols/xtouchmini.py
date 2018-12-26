#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Project Jupyter Contributors.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, widget_serialization, register
import ipywidgets
from traitlets import Unicode, CaselessStrEnum, Bool, CInt, validate, Instance, TraitError
from ._frontend import module_name, module_version

@register
class Button(DOMWidget):
    """A widget representing a button on a MIDI controller.
    """
    _model_name = Unicode('ButtonModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('ValueView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = Bool(False, help="Bool value").tag(sync=True)
    mode = CaselessStrEnum(
        values=['momentary', 'toggle'], default_value='momentary',
        help="""How the button changes value.""").tag(sync=True)


class _IntRange(DOMWidget):
    """A widget representing an integer range on a MIDI controller.
    """
    _model_name = Unicode('').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('ValueView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = CInt(0, help="Int value").tag(sync=True)
    max = CInt(100, help="Max value").tag(sync=True)
    min = CInt(0, help="Min value").tag(sync=True)

    def __init__(self, value=None, min=None, max=None, **kwargs):
        if value is not None:
            kwargs['value'] = value
        if min is not None:
            kwargs['min'] = min
        if max is not None:
            kwargs['max'] = max
        super(DOMWidget, self).__init__(**kwargs)

    @validate('value')
    def _validate_value(self, proposal):
        """Cap and floor value"""
        value = proposal['value']
        if self.min > value or self.max < value:
            value = min(max(value, self.min), self.max)
        return value

    @validate('min')
    def _validate_min(self, proposal):
        """Enforce min <= value <= max"""
        min = proposal['value']
        if min > self.max:
            raise TraitError('setting min > max')
        if min > self.value:
            self.value = min
        return min

    @validate('max')
    def _validate_max(self, proposal):
        """Enforce min <= value <= max"""
        max = proposal['value']
        if max < self.min:
            raise TraitError('setting max < min')
        if max < self.value:
            self.value = max
        return max

@register
class Rotary(_IntRange):
    """A widget representing a rotary knob on a MIDI controller.
    """
    _model_name = Unicode('RotaryModel').tag(sync=True)

    light_mode = CaselessStrEnum(
        values=['single', 'trim', 'wrap', 'spread'], default_value='single',
        help="""How the lights around the rotary dial indicate the value.""").tag(sync=True)

@register
class Fader(_IntRange):
    """A widget representing a fader on a MIDI controller.
    """
    _model_name = Unicode('FaderModel').tag(sync=True)
    max = CInt(127, help="Max value").tag(sync=True)


@register
class XTouchMini(DOMWidget):
    _model_name = Unicode('XTouchMiniModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('XTouchMiniView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # Child widgets in the container.
    # Using a tuple here to force reassignment to update the list.
    # When a proper notifying-list trait exists, use that instead.
    buttons = ipywidgets.trait_types.TypedTuple(trait=Instance(Button), help="Buttons in main area, top row left to right, then bottom row left to right").tag(
        sync=True, **widget_serialization)

    side_buttons = ipywidgets.trait_types.TypedTuple(trait=Instance(Button), help="Buttons on right side, top to bottom").tag(
        sync=True, **widget_serialization)

    rotary_buttons = ipywidgets.trait_types.TypedTuple(trait=Instance(Button), help="Rotary buttons left to right").tag(
        sync=True, **widget_serialization)

    rotary_encoders = ipywidgets.trait_types.TypedTuple(trait=Instance(Rotary), help="Rotary encoders left to right").tag(
        sync=True, **widget_serialization)

    faders = ipywidgets.trait_types.TypedTuple(trait=Instance(Fader), help="Fader").tag(
        sync=True, **widget_serialization)