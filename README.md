Manuscript WebHook Extension proxy
==================================

The main purpose of this app is to add (approximate) field names and field values of custom fields to Manuscript's case event webhook POSTs (which do not include custom field data) and forward them on to another destination.

Field names can only be approximated because of the way that Manuscript generates the storage field names for customer fields can't be reversed to actual field names.

Place the url and token of your Manuscript site and the url of the final destination for the webhook data.