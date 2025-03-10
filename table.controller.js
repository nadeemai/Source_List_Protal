sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/base/Log",
    "sap/m/Text",
    "sap/m/Input"
], function (Controller, JSONModel, MessageBox, Log, Text, Input) {
    "use strict";

    return Controller.extend("com.tableentry.tablestructure.controller.Table_Entry", {
        onInit: function () {
            var oData = {
                items: [
                    { product: "Notebook Basic 15", productCode: "HT-1000", quantity: "10 PC", weight: "4.2 KG", price: "9,564.00 EUR" },
                    { product: "Notebook Basic 17", productCode: "HT-1001", quantity: "20 PC", weight: "4.5 KG", price: "1,249.00 EUR" },
                    { product: "Notebook Basic 18", productCode: "HT-1002", quantity: "10 PC", weight: "4.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 19", productCode: "HT-1003", quantity: "15 PC", weight: "4.2 KG", price: "1,650.00 EUR" },
                    { product: "ITelO Vault", productCode: "HT-1007", quantity: "15 PC", weight: "0.2 KG", price: "299.00 EUR" },
                    { product: "Notebook Professional 15", productCode: "HT-1010", quantity: "16 PC", weight: "4.3 KG", price: "1,999.00 EUR" },
                    { product: "Notebook Professional 17", productCode: "", quantity: "17 PC", weight: "4.1 KG", price: "2,299.00 EUR" }
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");
        },

        onTableSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("products");
                var oData = oContext.getObject();

                var oDetailLayout = this.byId("detailLayout");
                oDetailLayout.removeAllItems();

                // Add detail information
                oDetailLayout.addItem(new Text({ text: "Product: " + oData.product }));
                oDetailLayout.addItem(new Text({ text: "Product Code: " + oData.productCode }));
                oDetailLayout.addItem(new Text({ text: "Quantity: " + oData.quantity }));
                oDetailLayout.addItem(new Text({ text: "Weight: " + oData.weight }));
                oDetailLayout.addItem(new Text({ text: "Price: " + oData.price }));

                this.byId("flexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
            }
        },

        onFullScreenPress: function () {
            var oLayout = this.byId("flexibleColumnLayout");
            if (oLayout.getLayout() === "OneColumn") {
                oLayout.setLayout("TwoColumnsMidExpanded");
                this.byId("fullScreenButton").setIcon("sap-icon://exit-full-screen");
            } else {
                oLayout.setLayout("OneColumn");
                this.byId("fullScreenButton").setIcon("sap-icon://full-screen");
            }
        },

        onEditPress: function (oEvent) {
            var oButton = oEvent.getSource();
            var oItem = oButton.getParent();
            var aCells = oItem.getCells();

            if (oButton.getIcon() === "sap-icon://edit") {
                oButton.setIcon("sap-icon://save");

                var oQuantityText = aCells[1];
                var oQuantityInput = new Input({ value: oQuantityText.getText() });
                oItem.removeCell(oQuantityText);
                oItem.insertCell(oQuantityInput, 1);
            } else {
                oButton.setIcon("sap-icon://edit");

                var oQuantityInput = aCells[1];
                var oQuantityText = new Text({ text: oQuantityInput.getValue() });
                oItem.removeCell(oQuantityInput);
                oItem.insertCell(oQuantityText, 1);
            }
        },

        onSavePress: function () {
            MessageBox.success("Changes saved successfully.");
        },

        onCancelPress: function () {
            this.onInit();
            MessageBox.information("Changes discarded.");
        },

        onOrderPress: function () {
            MessageBox.information("Order button pressed.");
        }
    });
});
