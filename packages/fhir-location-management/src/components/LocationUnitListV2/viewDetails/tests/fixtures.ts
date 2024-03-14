export const kiambuCountyInclude = {
	"resourceType": "Bundle",
	"id": "8502b489-afdf-4373-a1c3-4376741a4f4a",
	"meta": {
		"lastUpdated": "2024-03-12T08:38:32.033+00:00"
	},
	"type": "searchset",
	"total": 1,
	"link": [
		{
			"relation": "self",
			"url": "https://fhir.labs.smartregister.org/fhir/Location?_id=46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d&_include=Location%3Apartof"
		}
	],
	"entry": [
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d",
			"resource": {
				"resourceType": "Location",
				"id": "46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2023-12-01T07:51:01.158+00:00",
					"source": "#99bada28832032d9"
				},
				"identifier": [
					{
						"use": "official",
						"value": "d1aab054-4e19-4407-ae4b-1b15e03102f2"
					}
				],
				"status": "active",
				"name": "Kiambu County",
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				},
				"partOf": {
					"reference": "Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334",
					"display": "Central Province"
				}
			},
			"search": {
				"mode": "match"
			}
		},
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334",
			"resource": {
				"resourceType": "Location",
				"id": "d9d7aa7b-7488-48e7-bae8-d8ac5bd09334",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2023-12-01T07:44:56.087+00:00",
					"source": "#9991af7e3e351524"
				},
				"identifier": [
					{
						"use": "official",
						"value": "0b91d619-c6d0-4f6e-adcf-d570f0e70313"
					}
				],
				"status": "active",
				"name": "Central Province",
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				},
				"partOf": {
					"reference": "Location/fe9e549b-a427-4db6-aad9-edade11b6e6a",
					"display": "True Kenya"
				}
			},
			"search": {
				"mode": "include"
			}
		}
	]
}

export const trueKenyaInclude = {
	"resourceType": "Bundle",
	"id": "6ceb7ece-4281-44ab-a3c8-caa7fd4e6a0c",
	"meta": {
		"lastUpdated": "2024-03-12T09:14:15.682+00:00"
	},
	"type": "searchset",
	"total": 1,
	"link": [
		{
			"relation": "self",
			"url": "https://fhir.labs.smartregister.org/fhir/Location?_id=fe9e549b-a427-4db6-aad9-edade11b6e6a&_include=Location%3Apartof"
		}
	],
	"entry": [
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/fe9e549b-a427-4db6-aad9-edade11b6e6a",
			"resource": {
				"resourceType": "Location",
				"id": "fe9e549b-a427-4db6-aad9-edade11b6e6a",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2023-11-10T06:56:56.597+00:00",
					"source": "#eae3bf48525c1783"
				},
				"identifier": [
					{
						"use": "official",
						"value": "62949a1b-9dc7-46dd-83ee-a737a2b541bf"
					}
				],
				"status": "active",
				"name": "True Kenya",
				"alias": [
					"Ke-254"
				],
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				},
				"partOf": {
					"reference": "Location/2252",
					"display": "Root FHIR Location"
				}
			},
			"search": {
				"mode": "match"
			}
		},
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/2252",
			"resource": {
				"resourceType": "Location",
				"id": "2252",
				"meta": {
					"versionId": "3",
					"lastUpdated": "2021-10-14T13:10:14.524+00:00",
					"source": "#5887f723a045b500"
				},
				"identifier": [
					{
						"use": "official",
						"value": "eff94f33-c356-4634-8795-d52340706ba9"
					}
				],
				"status": "active",
				"name": "Root FHIR Location",
				"alias": [
					"Root Location"
				],
				"description": "This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.",
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				}
			},
			"search": {
				"mode": "include"
			}
		}
	]
}
export const centralProvinceInclude = {
	"resourceType": "Bundle",
	"id": "170873ef-7e54-49f1-891e-427815050412",
	"meta": {
		"lastUpdated": "2024-03-12T09:15:28.960+00:00"
	},
	"type": "searchset",
	"total": 1,
	"link": [
		{
			"relation": "self",
			"url": "https://fhir.labs.smartregister.org/fhir/Location?_id=d9d7aa7b-7488-48e7-bae8-d8ac5bd09334&_include=Location%3Apartof"
		}
	],
	"entry": [
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334",
			"resource": {
				"resourceType": "Location",
				"id": "d9d7aa7b-7488-48e7-bae8-d8ac5bd09334",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2023-12-01T07:44:56.087+00:00",
					"source": "#9991af7e3e351524"
				},
				"identifier": [
					{
						"use": "official",
						"value": "0b91d619-c6d0-4f6e-adcf-d570f0e70313"
					}
				],
				"status": "active",
				"name": "Central Province",
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				},
				"partOf": {
					"reference": "Location/fe9e549b-a427-4db6-aad9-edade11b6e6a",
					"display": "True Kenya"
				}
			},
			"search": {
				"mode": "match"
			}
		},
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/fe9e549b-a427-4db6-aad9-edade11b6e6a",
			"resource": {
				"resourceType": "Location",
				"id": "fe9e549b-a427-4db6-aad9-edade11b6e6a",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2023-11-10T06:56:56.597+00:00",
					"source": "#eae3bf48525c1783"
				},
				"identifier": [
					{
						"use": "official",
						"value": "62949a1b-9dc7-46dd-83ee-a737a2b541bf"
					}
				],
				"status": "active",
				"name": "True Kenya",
				"alias": [
					"Ke-254"
				],
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				},
				"partOf": {
					"reference": "Location/2252",
					"display": "Root FHIR Location"
				}
			},
			"search": {
				"mode": "include"
			}
		}
	]
}

export const rootFhirLocationInclude = {
	"resourceType": "Bundle",
	"id": "f42b6cc0-e368-4470-b747-22d6f29ca1ff",
	"meta": {
		"lastUpdated": "2024-03-12T09:16:12.250+00:00"
	},
	"type": "searchset",
	"total": 1,
	"link": [
		{
			"relation": "self",
			"url": "https://fhir.labs.smartregister.org/fhir/Location?_id=2252&_include=Location%3Apartof"
		}
	],
	"entry": [
		{
			"fullUrl": "https://fhir.labs.smartregister.org/fhir/Location/2252",
			"resource": {
				"resourceType": "Location",
				"id": "2252",
				"meta": {
					"versionId": "3",
					"lastUpdated": "2021-10-14T13:10:14.524+00:00",
					"source": "#5887f723a045b500"
				},
				"identifier": [
					{
						"use": "official",
						"value": "eff94f33-c356-4634-8795-d52340706ba9"
					}
				],
				"status": "active",
				"name": "Root FHIR Location",
				"alias": [
					"Root Location"
				],
				"description": "This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.",
				"physicalType": {
					"coding": [
						{
							"system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
							"code": "jdn",
							"display": "Jurisdiction"
						}
					]
				}
			},
			"search": {
				"mode": "match"
			}
		}
	]
}