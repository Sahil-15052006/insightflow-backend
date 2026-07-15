const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");

const {
  processData,
} = require("../services/cleaningService");

// Delete temporary uploaded file
const deleteFile = (filePath) => {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(
        "Failed to delete file:",
        err.message
      );
    }
  });
};

const uploadFile = async (req, res) => {
  // console.log("\n UPLOAD REQUEST ");
  // console.log("Headers:", req.headers["content-type"]);
  // console.log("File:", req.file);

  const file = req.file;

  try {
    // Validate upload
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded",
      });
    }

    const extension = file.originalname
      .split(".")
      .pop()
      ?.toLowerCase();

    // console.log("Detected Extension:", extension);
    // console.log("Mime Type:", file.mimetype);


    // CSV PROCESSING
    
    if (extension === "csv") {
      const rows = [];

      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (row) => {
          rows.push(row);
        })
        .on("end", () => {
          try {
            console.log(
              `CSV Parsed Successfully (${rows.length} rows)`
            );

            console.log(
              "Sample CSV Row:",
              rows[0]
            );

            const result = processData(rows);

            console.log(
              "Processing Successful"
            );

            deleteFile(file.path);

            return res.json({
              success: true,
              ...result,
            });
          } catch (err) {
            console.error(
              "\nCSV PROCESS ERROR"
            );
            console.error(err);

            deleteFile(file.path);

            return res.status(500).json({
              success: false,
              message:
                "Failed to process CSV file",
              error: err.message,
            });
          }
        })
        .on("error", (err) => {
          console.error(
            "\nCSV READ ERROR"
          );
          console.error(err);

          deleteFile(file.path);

          return res.status(500).json({
            success: false,
            message:
              "Failed to read CSV file",
            error: err.message,
          });
        });

      return;
    }

 
    // EXCEL PROCESSING
     
    if (
      extension === "xlsx" ||
      extension === "xls"
    ) {
      try {
        console.log(
          "Reading Excel file:",
          file.path
        );

        const workbook =
          xlsx.readFile(file.path);

        const sheetName =
          workbook.SheetNames[0];

        console.log(
          "Sheet Name:",
          sheetName
        );

        const sheet =
          workbook.Sheets[sheetName];

        const rows =
          xlsx.utils.sheet_to_json(sheet);

        console.log(
          `Excel Parsed Successfully (${rows.length} rows)`
        );

        console.log(
          "Sample Excel Row:",
          rows[0]
        );

        const result =
          processData(rows);

        console.log(
          "Processing Successful"
        );

        deleteFile(file.path);

        return res.json({
          success: true,
          ...result,
        });
      } catch (err) {
        console.error(
          "\nXLSX PROCESS ERROR"
        );
        console.error(err);

        deleteFile(file.path);

        return res.status(500).json({
          success: false,
          message:
            "Failed to process Excel file",
          error: err.message,
        });
      }
    }


    // UNSUPPORTED FILE TYPE

    deleteFile(file.path);

    return res.status(400).json({
      success: false,
      message:
        "Unsupported file type. Please upload CSV or Excel files only.",
    });

  } catch (err) {
    console.error(
      "\nUPLOAD CONTROLLER ERROR"
    );
    console.error(err);

    deleteFile(file?.path);

    return res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: err.message,
    });
  }
};

module.exports = {
  uploadFile,
};