import httpStatus from "http-status";
import { OpenAPIV3 } from "openapi-types";

export const docs: OpenAPIV3.Document = {
  info: {
    title: "contrary-assessment",
    version: "1.0.0",
  },
  openapi: "3.0.3",
  tags: [
    {
      name: "contrary-assessment",
    },
  ],
  components: {
    responses: {
      GetAvgTotalFundingOk: {
        description: "on success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                average: {
                  type: "number",
                  example: 108000000,
                },
              },
              required: ["average"],
            },
          },
        },
      },
      PersonIdNotFound: {
        description: "on person id is not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "person id not found",
                },
              },
              required: ["message"],
            },
          },
        },
      },
      InvalidPersonIdBadRequest: {
        description: "on person id is invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                personId: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "Invalid uuid",
                  },
                },
              },
              required: ["personId"],
            },
          },
        },
      },
      GetCompaniesOk: {
        description: "on success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                companies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              example: {
                companies: ["Amazon", "UMass Memorial Medical Center"],
              },
              required: ["companies"],
            },
          },
        },
      },
      GetInvestorsOk: {
        description: "on success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                investors: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              example: {
                investors: ["IBM"],
              },
              required: ["investors"],
            },
          },
        },
      },
      CompanyNotFound: {
        description: "on company is not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "company not found",
                },
              },
              required: ["message"],
            },
          },
        },
      },
      StatusOk: {
        description: "on success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "OK",
                },
              },
              required: ["status"],
            },
          },
        },
      },
    },
  },
  paths: {
    "/avg-funding-by-person/{personId}": {
      get: {
        tags: ["contrary-assessment"],
        description:
          "Get AVG Total Funding of the all companies that a person id worked",
        operationId: "getAvgTotalFunding",
        parameters: [
          {
            in: "path",
            name: "personId",
            schema: {
              type: "string",
              example: "92a52877-8d5d-41a6-950f-1b9c6574be7a",
            },
            required: true,
          },
        ],
        responses: {
          [httpStatus.OK]: {
            $ref: "#/components/responses/GetAvgTotalFundingOk",
          },
          [httpStatus.BAD_REQUEST]: {
            $ref: "#/components/responses/InvalidPersonIdBadRequest",
          },
          [httpStatus.NOT_FOUND]: {
            $ref: "#/components/responses/PersonIdNotFound",
          },
        },
      },
    },
    "/companies-by-person/{personId}": {
      get: {
        tags: ["contrary-assessment"],
        description: "Get all companies that a person has worked at",
        operationId: "getCompanies",
        parameters: [
          {
            in: "path",
            name: "personId",
            schema: {
              type: "string",
              example: "92a52877-8d5d-41a6-950f-1b9c6574be7a",
            },
            required: true,
          },
        ],
        responses: {
          [httpStatus.OK]: {
            $ref: "#/components/responses/GetCompaniesOk",
          },
          [httpStatus.BAD_REQUEST]: {
            $ref: "#/components/responses/InvalidPersonIdBadRequest",
          },
          [httpStatus.NOT_FOUND]: {
            $ref: "#/components/responses/PersonIdNotFound",
          },
        },
      },
    },
    "/investors-by-company/{linkedinName}": {
      get: {
        tags: ["contrary-assessment"],
        description: "Get all investors from a company by a linkedinName",
        operationId: "getInvestors",
        parameters: [
          {
            in: "path",
            name: "linkedinName",
            schema: {
              type: "string",
              example: "microsoft",
            },
            required: true,
          },
        ],
        responses: {
          [httpStatus.OK]: {
            $ref: "#/components/responses/GetInvestorsOk",
          },
          [httpStatus.NOT_FOUND]: {
            $ref: "#/components/responses/CompanyNotFound",
          },
        },
      },
    },
    "/status": {
      get: {
        tags: ["server"],
        description: "Get server status",
        operationId: "getStatus",
        responses: {
          [httpStatus.OK]: {
            $ref: "#/components/responses/StatusOk",
          },
        },
      },
    },
  },
};
