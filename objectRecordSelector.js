import { LightningElement, track, wire } from 'lwc';
import getObjectList from '@salesforce/apex/ObjectRecordController.getObjectList';
import getRecords from '@salesforce/apex/ObjectRecordController.getRecords';
import { NavigationMixin } from 'lightning/navigation';

export default class ObjectRecordSelector extends NavigationMixin(LightningElement) {
    @track objectOptions = [];
    @track recordOptions = [];
    selectedObject;
    selectedRecord;

    @wire(getObjectList)
    wiredObjectList({ error, data }) {
        if (data) {
            this.objectOptions = data.map(objName => ({ label: objName, value: objName }));
        } else if (error) {
            console.error(error);
        }
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.fetchRecords();
    }

    fetchRecords() {
        getRecords({ objectName: this.selectedObject })
            .then(data => {
                this.recordOptions = data.map(record => ({
                    label: record.Name,
                    value: record.Id
                }));
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleRecordChange(event) {
        this.selectedRecord = event.detail.value;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.selectedRecord,
                objectApiName: this.selectedObject,
                actionName: 'view'
            }
        });
    }
}
