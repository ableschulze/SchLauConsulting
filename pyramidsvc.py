# uncomment the next import line to get print to show up or see early
# exceptions if there are errors then run
# python -m win32traceutil
# to see the output
#import win32traceutil
import win32serviceutil

PORT_TO_BIND = 4332
CONFIG_FILE = 'production.ini'
SERVER_NAME = ''

SERVICE_NAME = "KomAppsProd"
SERVICE_DISPLAY_NAME = "KOM - APPS (Produktiv)"
SERVICE_DESCRIPTION = ""

class PyWebService(win32serviceutil.ServiceFramework):
    """Python Web Service."""

    _svc_name_ = SERVICE_NAME
    _svc_display_name_ = SERVICE_DISPLAY_NAME
    _svc_deps_ = None        # sequence of service names on which this depends
    # Only exists on Windows 2000 or later, ignored on Windows NT
    _svc_description_ = SERVICE_DESCRIPTION

    def SvcDoRun(self):
        from cherrypy import wsgiserver
        from pyramid.paster import get_app
        import os, sys

        path = os.path.dirname(os.path.abspath(__file__))

        os.chdir(path)

        app = get_app(CONFIG_FILE)

        self.server = wsgiserver.CherryPyWSGIServer(
                ('0.0.0.0', PORT_TO_BIND), app,
                server_name=SERVER_NAME)

        self.server.start()


    def SvcStop(self):
        self.server.stop()


if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(PyWebService)
