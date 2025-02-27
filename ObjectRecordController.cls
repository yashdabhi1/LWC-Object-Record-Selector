public with sharing class ObjectRecordController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectList() {
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        List<String> objectNames = new List<String>();
        for (String objectName : schemaMap.keySet()) {
            objectNames.add(objectName);
        }
        objectNames.sort(); 
        return objectNames;
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String objectName) {
        if (String.isEmpty(objectName)) {
            return new List<sObject>();
        }

        String query = 'SELECT Id, Name FROM ' + objectName; 
        return Database.query(query);
    }
}
