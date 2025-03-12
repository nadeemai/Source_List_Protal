sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("com.tableentry.tablestructure.controller.Table_Entry", {
        onInit: function () {
            // Initial data
            var oData = {
                items: [
                    { product: "Notebook Basic 11", productCode: "HT-1000", quantity: "10 PC", weight: "41.2 KG", price: "9,564.00 EUR" },
                    { product: "Notebook Basic 12", productCode: "HT-1001", quantity: "20 PC", weight: "41.5 KG", price: "1,249.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 11", productCode: "HT-1000", quantity: "10 PC", weight: "41.2 KG", price: "9,564.00 EUR" },
                    { product: "Notebook Basic 12", productCode: "HT-1001", quantity: "20 PC", weight: "41.5 KG", price: "1,249.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 11", productCode: "HT-1000", quantity: "10 PC", weight: "41.2 KG", price: "9,564.00 EUR" },
                    { product: "Notebook Basic 12", productCode: "HT-1001", quantity: "20 PC", weight: "41.5 KG", price: "1,249.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 11", productCode: "HT-1000", quantity: "10 PC", weight: "41.2 KG", price: "9,564.00 EUR" },
                    { product: "Notebook Basic 12", productCode: "HT-1001", quantity: "20 PC", weight: "41.5 KG", price: "1,249.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "411.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "41.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "411.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "411.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "411.2 KG", price: "1,570.00 EUR" },
                    { product: "Notebook Basic 13", productCode: "HT-1002", quantity: "10 PC", weight: "411.2 KG", price: "1,570.00 EUR" }
                ]
                
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "products");
        },

        // Download functionality
        onDownloadPress: function () {
            try {
                // Get current data
                var oModel = this.getView().getModel("products");
                var aData = oModel.getProperty("/items");

                if (!aData || aData.length === 0) {
                    MessageBox.warning("No data available to download.");
                    return;
                }

                // Convert to JSON string with proper formatting
                var sJsonData = JSON.stringify(aData, null, 2);
                
                // Create blob and download
                var oBlob = new Blob([sJsonData], { type: "application/json" });
                var sUrl = URL.createObjectURL(oBlob);
                var oLink = document.createElement("a");
                
                oLink.href = sUrl;
                oLink.download = "products_data_" + new Date().toISOString().slice(0,10) + ".json";
                document.body.appendChild(oLink);
                oLink.click();
                document.body.removeChild(oLink);
                URL.revokeObjectURL(sUrl); // Clean up

                MessageToast.show("Download completed successfully!");
            } catch (error) {
                MessageBox.error("Download failed: " + error.message);
                console.error(error);
            }
        },

        // Upload trigger
        onUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
            oFileUploader.clear(); // Reset previous selection
            oFileUploader.$().find("input[type=file]").click(); // Open file dialog
        },

        // Handle file upload
        onFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oFile = oEvent.getParameter("files") && oEvent.getParameter("files")[0];

            if (!oFile) {
                MessageBox.error("No file selected.");
                return;
            }

            if (oFile.type !== "application/json") {
                MessageBox.error("Please upload a JSON file.");
                oFileUploader.clear();
                return;
            }

            var oReader = new FileReader();
            oReader.onload = function (e) {
                try {
                    var sResult = e.target.result;
                    var oNewData = JSON.parse(sResult);

                    // Validate data
                    if (!Array.isArray(oNewData) || !oNewData.every(item => 
                        item.product && item.productCode && item.quantity && item.weight && item.price)) {
                        MessageBox.error("Invalid JSON format. Must contain array of objects with product, productCode, quantity, weight, and price.");
                        return;
                    }

                    // Update model
                    var oModel = this.getView().getModel("products");
                    oModel.setProperty("/items", oNewData);
                    MessageToast.show("Upload successful! " + oNewData.length + " items loaded.");

                    oFileUploader.clear(); // Reset uploader
                } catch (error) {
                    MessageBox.error("Upload failed: " + error.message);
                    console.error(error);
                }
            }.bind(this);

            oReader.onerror = function () {
                MessageBox.error("Error reading file.");
            };

            oReader.readAsText(oFile);
        },

        // Table selection
        onTableSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("products");
                var oData = oContext.getObject();
                var oDetailLayout = this.byId("detailLayout");
                
                oDetailLayout.removeAllContent();
                oDetailLayout.addContent(new sap.m.Text({ text: "Product: " + oData.product }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Code: " + oData.productCode }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Quantity: " + oData.quantity }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Weight: " + oData.weight }));
                oDetailLayout.addContent(new sap.m.Text({ text: "Price: " + oData.price }));

                this.byId("flexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
                this.byId("fullScreenButton").setVisible(false);
                this.byId("exitFullScreenButton").setVisible(true);
            }
        },

        // Full screen controls
        onFullScreenPress: function () {
            this.byId("flexibleColumnLayout").setLayout("TwoColumnsMidExpanded");
            this.byId("fullScreenButton").setVisible(false);
            this.byId("exitFullScreenButton").setVisible(true);
        },

        onExitFullScreenPress: function () {
            this.byId("flexibleColumnLayout").setLayout("OneColumn");
            this.byId("fullScreenButton").setVisible(true);
            this.byId("exitFullScreenButton").setVisible(false);
        },

        // Edit functionality
        onEditPress: function (oEvent) {
            var oButton = oEvent.getSource();
            var oItem = oButton.getParent();
            var aCells = oItem.getCells();

            if (oButton.getIcon() === "sap-icon://edit") {
                oButton.setIcon("sap-icon://save");
                for (var i = 1; i < 4; i++) {
                    var oText = aCells[i];
                    var oInput = new sap.m.Input({ value: oText.getText() });
                    oItem.removeCell(oText);
                    oItem.insertCell(oInput, i);
                }
            } else {
                oButton.setIcon("sap-icon://edit");
                var oModel = this.getView().getModel("products");
                var oData = oItem.getBindingContext("products").getObject();
                for (var i = 1; i < 4; i++) {
                    var oInput = aCells[i];
                    var sValue = oInput.getValue();
                    var oText = new sap.m.Text({ text: sValue });
                    oItem.removeCell(oInput);
                    oItem.insertCell(oText, i);
                    // Update model
                    if (i === 1) oData.quantity = sValue;
                    if (i === 2) oData.weight = sValue;
                    if (i === 3) oData.price = sValue;
                }
                oModel.refresh();
            }
        },

        // Delete functionality
        onDeletePress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oModel = this.getView().getModel("products");
            var aItems = oModel.getProperty("/items");
            var iIndex = oItem.getParent().indexOfItem(oItem);
            
            aItems.splice(iIndex, 1);
            oModel.setProperty("/items", aItems);
            MessageToast.show("Item deleted successfully");
        },

        // Order button
        onOrderPress: function () {
            MessageToast.show("Order placed successfully!");
        }
    });
});
