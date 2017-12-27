var clientContext;


function CleanCIMFiles() {
    clientContext = new SP.ClientContext.get_current();
    var filterFile = 'PF3';
    var oCurrentList = clientContext.get_web().get_lists().getByTitle('Site Assets');
    var camlQuery = new SP.CamlQuery();
    //camlQuery.set_viewXml('<View><Query><Where><BeginsWith><FieldRef Name=\'FileLeafRef\'/>' + '<Value Type=\'Text\'>' + filterFile + '</Value></Contains></Where></Query></View>');

    //camlQuery.set_viewXml('"<View Scope=\'Recursive\'><Query><And><Eq><FieldRef Name=\'FileDirRef\' /> <Value Type=\'Text\'>html</Value></Eq><BeginsWith><FieldRef Name=\'FileLeafRef\'/><Value Type=\'Text\'>PF3</Value></BeginsWith></And></Query><RowLimit>100</RowLimit></View>');
    camlQuery.set_viewXml('<View Scope=\'Recursive\'><Query><Eq><FieldRef Name=\'FileDirRef\'/><Value Type=\'Text\'>html</Value></Eq></Query><RowLimit>2000</RowLimit></View>');
    alert('You are about to delete a lot of files v.6');

    this.collListItem = oCurrentList.getItems(camlQuery);
    clientContext.load(collListItem);
    //clientContext.ExecuteQuery();


    //clientContext.executeQueryAsync(functionNameOfShowData, onQueryFailed);


    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.functionNameOfShowData),
        Function.createDelegate(this, this.onQueryFailed));


}

function functionNameOfShowData(sender, args) {


    var listItemInfo = '';
    var listItemEnumerator = collListItem.getEnumerator();

    var oCurrentList = clientContext.get_web().get_lists().getByTitle('Site Assets');
    var itemToDelete;
    //var oCurrentList = clientContext.get_web().get_lists().getByTitle('Site Assets');
    var itemcount = collListItem.get_count();
    var fileName;
    var fileID;
    var filesDeleted = 0;

    while (listItemEnumerator.moveNext()) {
        oListItem = listItemEnumerator.get_current();

        fileName = oListItem.get_item('FileLeafRef');
        fileID = oListItem.get_id();


        if ((fileName.indexOf("PF") >= 0) ||
            (fileName.indexOf("QF") >= 0)) {
            itemToDelete = oCurrentList.getItemById(fileID);
            itemToDelete.deleteObject();
            filesDeleted++;
            if (filesDeleted == 100) {
                clientContext.executeQueryAsync(
                    Function.createDelegate(this, this.Succeeded),
                    Function.createDelegate(this, this.onDeleteFailed)
                );
                filesDeleted = 0;
            }
        }
    }
    clientContext.executeQueryAsync(
        Function.createDelegate(this, this.Succeeded),
        Function.createDelegate(this, this.onDeleteFailed)
    );
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function onDeleteFailed(sender, args) {


    alert('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function Succeeded() {}