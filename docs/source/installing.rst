
.. _installation:

Installation
============


The simplest way to install ipymidicontrols is via pip::

    pip install ipymidicontrols

or via conda::

    conda install ipymidicontrols


If you installed via pip, and notebook version < 5.3, you will also have to
install / configure the front-end extension as well. If you are using classic
notebook (as opposed to Jupyterlab), run::

    jupyter nbextension install [--sys-prefix / --user / --system] --py ipymidicontrols

    jupyter nbextension enable [--sys-prefix / --user / --system] --py ipymidicontrols

with the `appropriate flag`_. If you are using Jupyterlab, install the extension
with::

    jupyter labextension install @jupyter-widgets/midicontrols

In JupyterLab, you will also need to install the ipywidgets extension::

    jupyter labextension install @jupyter-widgets/jupyterlab-manager


.. links

.. _`appropriate flag`: https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#installing-and-enabling-extensions
