myapp.controller('ngKOMAppsMesseUndFoederpreise', function($scope, $http, $compile)
{
    GetEventTypen($scope, $http);

    $scope.fehlerMessage = ""
    $scope.error = 0
    $scope.modalTitle = ""
    $scope.navItem = 5
    $scope.pager = 10
    $scope.tn_actual = 1
    $scope.wa_actual = 1
    $scope.SelTN = null

    $scope.showWarteliste = false;
    $scope.showTeilnehmer = false;
    $scope.showReports = false;
    $scope.refreshData = function() { EventSelectedChanged($scope, $http) }
    $scope.ModalSaveClick = function() { ModalSaveClick($scope, $http) }
    $scope.ShowMessageBox = function() { return ShowMessageBox($scope) }
    $scope.VerschiebenTNClick = function(tn) { VerschiebenClick($scope, $http, tn , 1)}
    $scope.VerschiebenWAClick = function(tn) { VerschiebenClick($scope, $http, tn , 0)}
    $scope.ZusageClick = function(tn) { Zusage_Click($scope, $http, tn)}
    $scope.AnwesendClick = function(tn) { Anwesend_Click($scope, $http, tn)}
    $scope.TeilnehmerShowNavSpecial = function(){ return ShowNavSpecial($scope.tn_actual, $scope.navItem, $scope.tn_split)}
    $scope.WartelisteShowNavSpecial = function(){ return ShowNavSpecial($scope.wa_actual, $scope.navItem, $scope.wa_split)}
    $scope.GetRangeTeilnehmer = function(){ return GetRange($scope.tn_actual, $scope.navItem, $scope.tn_split)}
    $scope.GetRangeWarteliste = function(){ return GetRange($scope.wa_actual, $scope.navItem, $scope.wa_split)}
    $scope.ShowModal = function(){ $('#myModal').modal('show') }
    $scope.TeilnehmerNavClick = function(click) { NavClick($scope, click, 1 ) }
    $scope.WartelisteNavClick = function(click) { NavClick($scope, click, 2 ) }
    $scope.EventSelectedChanged = function(){ EventSelectedChanged($scope, $http) }
    $scope.BearbeitenTNClick = function(tn){ BearbeitenClick($scope, tn, 0) }
    $scope.BearbeitenWAClick = function(tn){ BearbeitenClick($scope, tn, 1) }
    $scope.ClickNewTeilnehmer = function() { ClickNewTeilnehmer($scope) }
    $scope.TNNavClick = function(click){ NavClick($scope, click, $scope.tn_split, 0)}
    $scope.WANavClick = function(click){ NavClick($scope, click, $scope.wa_split, 1)}
    $scope.FilterTNChanged = function(){ FilterChanged($scope, 0, $scope.txtFilter)}
    $scope.FilterWAChanged = function(){ FilterChanged($scope, 1, $scope.txtFilterWa)}
    $scope.TeilnehmerDelClick = function(){ DeleteTeilnehmer($scope, $http) }
    $scope.filterReports = function(){ return filterReports($scope) }
    $scope.ShowDelButton = function() { return ShowDelButton($scope) }
    $scope.filterEvents = function(){
        return function (item){
            /*console.log($scope.cboEventtyp.ID )*/
            if (item.Typ == $scope.cboEventtyp.ID)
            {
                return true;
            }
            return false;
        };
    };
    $scope.filterData = function(){
        return function (item){
            /*console.log($scope.cboEventtyp.ID )*/
            if (item.Typ == $scope.cboEventtyp.ID)
            {
                return true;
            }
            return false;
        };
    };
})

function refreshModal($scope){
    $scope.cboFirma = $scope.datafirmen[0]
    $scope.cboAnrede = $scope.dataanrede[0]
    $scope.cboTitel = $scope.datatitel[0]
    $scope.txtName = ''
    $scope.txtVorname = ''
    $scope.txtBemerkung = ''
}

function SelectItemAnrede($scope, value){
     angular.forEach($scope.dataanrede, function(anrede)
     {
        if (anrede.ID == value)
        {
            $scope.cboAnrede = anrede;
            return;
        }
     });
}
function SelectItemFirma($scope, value){
     angular.forEach($scope.datafirmen, function(firma)
     {
        if (firma.FirmaName == value)
        {
            $scope.cboFirma = firma;
            return;
        }
     });
}
function SelectItemTitel($scope, value){
     angular.forEach($scope.datatitel, function(titel)
     {
        if (titel.TitelID == value)
        {
            $scope.cboTitel = titel;
            return;
        }
     });
}

function DeleteTeilnehmer($scope, $http){
    var AnredeName = (($scope.cboAnrede != null) ? $scope.cboAnrede.Bezeichnung : '')
    var TitelName = (($scope.cboTitel != null) ? $scope.cboTitel.Name : '')
    var txtName = (($scope.txtName != null) ? $scope.txtName : '')
    var Vorname = (($scope.txtVorname != null) ? $scope.txtVorname : '')
    var Bemerkung = (($scope.txtBemerkung != null) ? $scope.txtBemerkung : '')
    var Name = ""

    if(TitelName != '')
        Name = Name + " " + TitelName
    if(AnredeName != '')
        Name = Name + " " + AnredeName

    Name = Name + " " + Vorname + " " + txtName
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer'
        ,method  : "DELETE"
        ,data    : {
                          id : $scope.SelTN.ID
                         ,eventid : $scope.cboEvent.ID
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {
            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Teilnehmer '" + Name + "' wurde erfolgreich gelöscht!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
                $('#myModal').modal('toggle')
            }
            else
            {
                $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht gelöscht werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
            $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht gelöscht werden!"
            $scope.error = 1
        }
    );
}


function filterReports($scope){
    if($scope.cboEventtyp != null & $scope.cboEvent != null)
    {
        var quelle, filterQuelle, rep, eventid
        var filterQuelle = []

        quelle = $scope.datareports
        eventid = $scope.cboEvent.ID

        for(var i = 0; i < quelle.length; i++)
        {
            if(quelle[i].EventID == eventid)
                filterQuelle.push(quelle[i])
        }

        $scope.reports = filterQuelle
        $scope.showReports  = ((filterQuelle.length > 0) ? true : false)
    }
    else
    {
        $scope.showReports = false
    }
}


function filterEvents($scope, event){
    if (event.Typ == $scope.cboEventtyp.ID)
    {
        return true;
    }
    return false;
};


function FilterChanged($scope, typ, filter){
    var quelle = null
    filterQuelle = null

    if(typ == 0)
        quelle = $scope.datateilnehmer
    else
        quelle = $scope.datawarteliste

    var filterQuelle = []
    if(quelle != null & filter != null)
    {
        for(var i = 0; i < quelle.length; i++)
        {
            var obj = quelle[i];
            for(var key in obj)
            {
                var value = String(obj[key]).toUpperCase()
                if(value.indexOf(filter.toUpperCase()) > -1)
                {
                    filterQuelle.push(obj)
                    break
                }
            }
        }

        if(typ == 0)
            $scope.teilnehmer = filterQuelle
        else
            $scope.warteliste = filterQuelle
    }
}


/*Steuert die Anzeige des Löschen-Button im Modal Fenster (Bearbeiten, Neu)*/
function ShowDelButton($scope){
    if($scope.SelTN != null)
    {
        return true
    }
    else
    {
        return false
    }
}


/*Steuert die Anzeige der Messagebox*/
function ShowMessageBox($scope){
    if($scope.fehlerMessage.trim() == "")
        return false
    else
        return true
}

function VerschiebenClick($scope, $http, tn, typ){
    var Name = ""
    if(tn.Titel != null)
        Name = Name + " " + tn.Titel
    if(tn.Anrede != null)
        Name = Name + " " + tn.Anrede

    Name = Name + " " + tn.Vorname + " " + tn.Name
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer_verschieben'
        ,method  : "POST"
        ,data    : {
                          eventid : $scope.cboEvent.ID
                         ,id : tn.ID
                         ,nachruecker : typ
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {

            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Teilnehmer '" + Name + "' wurde erfolgreich verschoben!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
            }
            else
            {
                $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht verschoben werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
            $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht verschoben werden!"
            $scope.error = 1
        }
    );
}
function Anwesend_Click($scope, $http, tn){
    var Name = ""
    if(tn.Titel != null)
        Name = Name + " " + tn.Titel
    if(tn.Anrede != null)
        Name = Name + " " + tn.Anrede

    Name = Name + " " + tn.Vorname + " " + tn.Name
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer_anwesend'
        ,method  : "POST"
        ,data    : {
                          eventid : $scope.cboEvent.ID
                         ,id : tn.ID
                         ,anwesend : !tn.AnwesenheitID
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {
            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' wurde erfolgreich gesetzt!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
            }
            else
            {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' konnt nicht gesetzt werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' konnt nicht gesetzt werden!"
                $scope.error = 1
        }
    );
}
function Zusage_Click($scope, $http, tn){
    var Name = ""
    if(tn.Titel != null)
        Name = Name + " " + tn.Titel
    if(tn.Anrede != null)
        Name = Name + " " + tn.Anrede

    Name = Name + " " + tn.Vorname + " " + tn.Name
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer_zusage'
        ,method  : "POST"
        ,data    : {
                          eventid : $scope.cboEvent.ID
                         ,id : tn.ID
                         ,zusage : !tn.ZusageID
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {
            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' wurde erfolgreich gesetzt!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
            }
            else
            {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' konnt nicht gesetzt werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
                $scope.fehlerMessage = "Der Status des Teilnehmers '" + Name + "' konnt nicht gesetzt werden!"
                $scope.error = 1
        }
    );
}

function ArtikelNavClick($scope, click, typ){
    if(click > 0 && click <= $scope.split)
    {
        $scope.tn_actual = click
    }
}

function TeilnehmerAddClick($scope, $http){
    var EventID = (($scope.cboEvent != null) ? $scope.cboEvent.ID : -1)
    var FirmaName = (($scope.Firma != null) ? $scope.cboFirma.FirmaName : '')
    var AnredeID = (($scope.cboAnrede != null) ? $scope.cboAnrede.ID : -1)
    var AnredeName = (($scope.cboAnrede != null) ? $scope.cboAnrede.Bezeichnung : '')
    var TitelID = (($scope.cboTitel != null) ? $scope.cboTitel.ID : -1)
    var TitelName = (($scope.cboTitel != null) ? $scope.cboTitel.Name : '')
    var txtName = (($scope.txtName != null) ? $scope.txtName : '')
    var Vorname = (($scope.txtVorname != null) ? $scope.txtVorname : '')
    var Bemerkung = (($scope.txtBemerkung != null) ? $scope.txtBemerkung : '')
    var Name = ""

    if(TitelName != '')
        Name = Name + " " + TitelName
    if(AnredeName != '')
        Name = Name + " " + AnredeName

    Name = Name + " " + Vorname + " " + txtName
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer'
        ,method  : "POST"
        ,data    : {
                          eventid : EventID
                         ,firma : FirmaName
                         ,anredeid : AnredeID
                         ,titelid : TitelID
                         ,name : txtName
                         ,vorname : Vorname
                         ,bemerkung : Bemerkung
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {

            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Teilnehmer '" + Name + "' wurde erfolgreich als Gast hinzugefügt!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
                $('#myModal').modal('toggle')
            }
            else
            {
                $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht als Gast hinzugefügt werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
            $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht als Gast hinzugefügt werden!"
            $scope.error = 1
        }
    );
}

function TeilnehmerUpdateClick($scope, $http){
    var AnredeName = (($scope.cboAnrede != null) ? $scope.cboAnrede.Bezeichnung : '')
    var TitelName = (($scope.cboTitel != null) ? $scope.cboTitel.Name : '')
    var txtName = (($scope.txtName != null) ? $scope.txtName : '')
    var Vorname = (($scope.txtVorname != null) ? $scope.txtVorname : '')
    var Bemerkung = (($scope.txtBemerkung != null) ? $scope.txtBemerkung : '')
    var Name = ""

    if(TitelName != '')
        Name = Name + " " + TitelName
    if(AnredeName != '')
        Name = Name + " " + AnredeName

    Name = Name + " " + Vorname + " " + txtName
    Name = Name.trim()

    $http(
    {
         url     : urlServer + 'kom_em_teilnehmer'
        ,method  : "PATCH"
        ,data    : {
                          id : $scope.SelTN.ID
                         ,eventid : $scope.cboEvent.ID
                         ,firma : $scope.cboFirma.FirmaName
                         ,anredeid : $scope.cboAnrede.ID
                         ,titelid : $scope.cboTitel.ID
                         ,name : txtName
                         ,vorname : Vorname
                         ,bemerkung : Bemerkung
                   }
        ,headers: {'Content-Type' : 'application/json'}
    }
    ).then
    (
        function successCallback(response)
        {

            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.fehlerMessage = "Der Teilnehmer '" + Name + "' wurde erfolgreich geändert!"
                $scope.error = 0
                EventSelectedChanged($scope, $http)
                $('#myModal').modal('toggle')
            }
            else
            {
                $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht geändert werden!"
                $scope.error = 1
            }
        },
        function errorCallback(response)
        {
            $scope.fehlerMessage = "Es ist ein Fehler aufgetreten! Der Teilnehmer '" + Name + "' konnte nicht geändert werden!"
            $scope.error = 1
        }
    );
}


function ModalSaveClick($scope, $http)
{
    if($scope.SelTN != null)
    {
        TeilnehmerUpdateClick($scope, $http)
    }
    else
    {
        TeilnehmerAddClick($scope, $http)
    }
}


function BearbeitenClick($scope, tn){
    SelectItemFirma($scope, tn.Firma)
    SelectItemAnrede($scope, tn.AnredeID)
    SelectItemTitel($scope, tn.TitelID)
    $scope.txtName = tn.Name
    $scope.txtVorname = tn.Vorname
    $scope.txtBemerkung = tn.Bemerkung

    var AnredeName = (($scope.cboAnrede != null) ? $scope.cboAnrede.Bezeichnung : '')
    var TitelName = (($scope.cboTitel != null) ? $scope.cboTitel.Name : '')
    var txtName = (($scope.txtName != null) ? $scope.txtName : '')
    var Vorname = (($scope.txtVorname != null) ? $scope.txtVorname : '')
    var Name = ""

    if(TitelName != '')
        Name = Name + " " + TitelName
    if(AnredeName != '')
        Name = Name + " " + AnredeName

    Name = Name + " " + Vorname + " " + txtName
    Name = Name.trim()

    $scope.SelTN = tn

    $('#myModal').modal('toggle')
    $scope.modalTitle = "Teilnehmer '" + Name +  "'"
}


function ClickNewTeilnehmer($scope){
    refreshModal($scope)
    $scope.modalTitle = "Neuer Teilnehmer (Gast)"
    $scope.SelTN = null
}


function EventSelectedChanged($scope, $http){
    if($scope.cboEvent != null)
    {
        $http(
        {
             url     : urlServer + 'kom_em_teilnehmer_warteliste'
            ,method  : "GET"
            ,params  : {
                             id : $scope.cboEvent.ID
                            ,pager: $scope.pager
                       }
        }
        ).then
        (
            function successCallback(response)
            {
                statuscode = response.status;
                if(statuscode == '200')
                {
                    $scope.datateilnehmer = response.data["teilnehmer"]
                    $scope.datawarteliste = response.data["warteliste"]

                    $scope.teilnehmer = $scope.datateilnehmer
                    $scope.warteliste = $scope.datawarteliste

                    $scope.wa_split = response.data["wa_split"]
                    $scope.tn_split = response.data["tn_split"]

                    $scope.wa_col = response.data["wa_col"]
                    $scope.tn_col = response.data["tn_col"]

                    if($scope.teilnehmer.length  == null)
                        $scope.showTeilnehmer = false;
                    else
                        $scope.showTeilnehmer = true;

                    if($scope.warteliste.length == 0)
                        $scope.showWarteliste = false;
                    else
                        $scope.showWarteliste = true;
                }
                else
                {
                    $scope.teilnehmer = null
                    $scope.warteliste = null

                    $scope.showTeilnehmer = false;
                    $scope.showWarteliste = false;
                }


                $scope.FilterTNChanged()
                $scope.FilterWAChanged()
            },
            function errorCallback(response)
            {
                $scope.showTeilnehmer = false;
                $scope.showWarteliste = false;
            }
        );
    }
    else
    {
        $scope.showTeilnehmer = false;
        $scope.showWarteliste = false;
    }
}

function GetEventTypen($scope, $http){
    $http(
    {
        url     : urlServer + 'kom_em_eventtypen',
        method  : "GET"
    }
    ).then
    (
        function successCallback(response)
        {
            statuscode = response.status;
            if(statuscode == '200')
            {
                $scope.Eventtypen = response.data["typen"]
                $scope.datareports = response.data["reports"]
                $scope.Events = response.data["events"]

                $scope.datafirmen = response.data["firmen"]
                $scope.dataanrede = response.data["anrede"]
                $scope.datatitel = response.data["titel"]

                $scope.cboEventtyp = $scope.Eventtypen[0]

                refreshModal($scope)
            }
            else
            {
                $scope.Eventtypen = null
                $scope.Events = null
            }
        },
        function errorCallback(response)
        {

        }
    );
 }
function GetEventManagementSite($scope, $http, $compile){
    $http(
    {
        url     : urlServer + 'kom_eventmanagement',
        method  : "GET"
    }
    ).then
    (
        function successCallback(response)
        {
            statuscode = response.status;
            if(statuscode == '200')
            {
                var resultHtml = $compile(response.data)($scope);
                var mainContainer = angular.element( document.querySelector( '#mainFrame' ) );
                mainContainer.empty()
                mainContainer.append(resultHtml);
            }
            else
            {

            }
        },
        function errorCallback(response)
        {

        }
    );
 }
