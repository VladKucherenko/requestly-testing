import axios, { AxiosRequestConfig } from "axios";
// import https from 'https';
const sheetName: string = "Sheet1";
const sheetId: number = 1196872439;

const apiBaseUrl = `https://requestly.tech/api/mockv2`;

export interface SpreadSheetResponse {
  values: string[][];
}

export const getSpreasheetData = async () => {
  const response = await axios.get<SpreadSheetResponse>(
    `${apiBaseUrl}/values/todos?username=user1708677133497&`,
  );
  return response.data;
};

export const getTestData = async () => {
  const response = await axios.get<SpreadSheetResponse>(
    `http://localhost:3000/values/todos`,
  );
  return response.data;
};

/**
 * Function to append data to the spreadsheet
 * @param data string[]
 * @returns
 */
export const appendSpreadsheetData = async (
  data: (string | number | boolean)[]
) => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${apiBaseUrl}/values/${sheetName}:append`,
    params: {
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      includeValuesInResponse: true,
    },
    data: {
      values: [data],
    },
  };

  const response = await axios(options);
  return response.data;
};

export const updateSpreadsheetData = async (
  index: number,
  values: (string | number | boolean)[]
) => {
  const options: AxiosRequestConfig = {
    method: "PUT",
    url: `${apiBaseUrl}/values/${sheetName}!A${index + 1}`,
    params: {
      valueInputOption: "USER_ENTERED",
      includeValuesInResponse: true,
    },
    data: {
      values: [values],
    },
  };

  const response = await axios(options);
  return response.data;
};

export const deleteSpreadsheetRow = async (index: number) => {
  const range = {
    sheetId: sheetId,
    dimension: "ROWS",
    startIndex: index,
    endIndex: index+1,
  };
  console.log(`deleting row from ${range.startIndex} to ${range.endIndex}`)
  const options: AxiosRequestConfig = {
    method: "POST",
    url: `${apiBaseUrl}:batchUpdate`,
    data: {
      requests: [
        {
          deleteDimension: {
            range,
          },
        },
      ],
    },
  };

  const response = await axios(options);
  return response.data;
};
