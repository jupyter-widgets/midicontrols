#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Project Jupyter Contributors.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..xtouchmini import XTouchMini


def test_example_creation_blank():
    w = XTouchMini()
    assert w
