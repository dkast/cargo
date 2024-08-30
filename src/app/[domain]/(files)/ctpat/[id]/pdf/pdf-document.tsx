"use client"

import {
  InspectionResult,
  InspectionTripType,
  type InspectionItem,
  type Organization,
  type Prisma
} from "@prisma/client"
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { type getInspectionById } from "@/server/fetchers/ctpat"

const style = StyleSheet.create({
  header: {
    flexBasis: "40px",
    borderBottom: "1px solid black",
    flexDirection: "row"
  },
  block: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4px"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  label: {
    flex: 1,
    textAlign: "right"
  },
  underline: {
    flex: 1,
    borderBottom: "1px solid black",
    marginLeft: "4px",
    paddingBottom: "2px"
  },
  th: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: "10px",
    paddingVertical: "2px"
  },
  td: {
    textAlign: "center",
    fontSize: "10px",
    paddingVertical: "2px"
  },
  signature: {
    flex: 1,
    borderBottom: "1px solid black",
    paddingBottom: "2px",
    marginHorizontal: "4px",
    textAlign: "center"
  }
})

export default function PDFDocument({
  inspection,
  organization
}: {
  inspection: Prisma.PromiseReturnType<typeof getInspectionById>
  organization: Organization
}) {
  if (!inspection) {
    return null
  }

  return (
    <PDFViewer className="grow">
      <Document
        title={`Inspección CTPAT No. ${inspection.inspectionNbr.toString().padStart(5, "0")}`}
      >
        <Page
          size="LETTER"
          style={{
            paddingHorizontal: "0.3in",
            paddingVertical: "0.5in"
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid black"
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <View style={style.header}>
                <View
                  style={{
                    flexBasis: "20%",
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image
                      src={
                        organization?.image
                          ? {
                              uri: organization?.image,
                              method: "GET",
                              headers: { "Cache-Control": "no-cache" },
                              body: ""
                            }
                          : "/logo.png"
                      }
                      style={{
                        width: "auto",
                        height: "45px",
                        padding: "4px"
                      }}
                    />
                    {!organization?.image && (
                      <Text style={{ fontSize: "12px" }}>
                        {organization.name}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text>Inspección de los 17 puntos críticos</Text>
                </View>
                <View
                  style={{
                    flexBasis: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px"
                  }}
                >
                  <Text>
                    #{inspection.inspectionNbr.toString().padStart(5, "0")}
                  </Text>
                </View>
              </View>
              {/* Master */}
              <View
                style={{
                  flexBasis: "3in",
                  fontSize: "8px",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  padding: "10px",
                  borderBottom: "1px solid black"
                }}
              >
                <View style={style.row}>
                  <View style={style.block}>
                    <Text style={style.label}>Fecha y Hora:</Text>
                    <Text style={style.underline}>
                      {inspection.start instanceof Date
                        ? format(inspection.start, "Pp", { locale: es })
                        : format(new Date(inspection.start), "Pp", {
                            locale: es
                          })}
                    </Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>Tipo:</Text>
                    <Text style={style.underline}>
                      {inspection.tripType === InspectionTripType.IN
                        ? "Entrada"
                        : "Salida"}
                    </Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>Ingresa cargado:</Text>
                    <Text style={style.underline}>
                      {inspection.isLoaded ? "Sí" : "No"}
                    </Text>
                  </View>
                </View>

                <View style={style.row}>
                  <View style={[style.block, { flexBasis: "28%" }]}>
                    <Text style={style.label}>Transportista:</Text>
                    <Text style={[style.underline, { flexBasis: "35%" }]}>
                      {inspection.company.name}
                    </Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>No. Tractor:</Text>
                    <Text style={style.underline}>
                      {inspection.vehicle.vehicleNbr}
                    </Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>No. Remolque:</Text>
                    <Text style={style.underline}>
                      {inspection.container?.containerNbr && "Sin remolque"}
                    </Text>
                  </View>
                </View>

                <View style={style.row}>
                  <View style={style.block}>
                    <Text style={style.label}>Nombre Operador:</Text>
                    <Text style={[style.underline, { flexBasis: "35%" }]}>
                      {inspection.operator.name}
                    </Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>Placas:</Text>
                    <Text style={style.underline}>
                      {inspection.vehicle.licensePlate}
                    </Text>
                  </View>
                </View>

                <View style={style.row}>
                  <View style={style.block}>
                    <Text style={style.label}>Firma Operador:</Text>
                    <Text
                      style={[style.underline, { flexBasis: "35%" }]}
                    ></Text>
                  </View>
                  <View style={style.block}>
                    <Text style={style.label}>No. Licencia:</Text>
                    <Text style={style.underline}>
                      {inspection.operator.licenseNumber}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src="/ctpat-inspection.png" style={{ width: "50%" }} />
                </View>
              </View>
              {/* Detail */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexBasis: "35%",
                      borderRight: "1px solid black",
                      borderBottom: "1px solid black",
                      alignContent: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={style.th}>Puntos a Revisar</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ borderBottom: "1px solid black" }}>
                      <Text style={style.th}>Inspección</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid black"
                      }}
                    >
                      <View
                        style={{
                          flexBasis: "30%",
                          borderRight: "1px solid black"
                        }}
                      >
                        <Text style={style.th}>Resultado</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={style.th}>Descripción del Hallazgo</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Questions */}
                {inspection.inspectionItems.map(
                  (question: Partial<InspectionItem>) => (
                    <View key={question.id} style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          flexBasis: "35%",
                          borderRight: "1px solid black",
                          borderBottom: "1px solid black",
                          alignContent: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          style={[
                            style.td,
                            { textAlign: "left", paddingHorizontal: "4px" }
                          ]}
                        >
                          {typeof question.order === "number" &&
                          question.order < 17
                            ? `${question.order + 1}.- ${question.question}`
                            : question.question}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            borderBottom: "1px solid black"
                          }}
                        >
                          <View
                            style={{
                              flexBasis: "30%",
                              borderRight: "1px solid black"
                            }}
                          >
                            <Text style={style.td}>
                              {(() => {
                                switch (question.result) {
                                  case InspectionResult.PASS:
                                    return "OK"
                                  case InspectionResult.FAIL:
                                    return "FALLA"
                                  default:
                                    return null
                                }
                              })()}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={[
                                style.td,
                                { textAlign: "left", paddingHorizontal: "4px" }
                              ]}
                            >
                              {question.notes}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                )}

                {/* Extra Info */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    fontSize: "10px",
                    padding: "4px"
                  }}
                >
                  <View
                    style={{
                      flexBasis: "35%"
                    }}
                  >
                    <Text style={[style.label, { textAlign: "left" }]}>
                      Número de Sello de Seguridad
                    </Text>
                  </View>
                  <View style={{ flexBasis: "35%" }}>
                    <Text style={[style.underline, { flexBasis: "35%" }]}>
                      {inspection.sealNbr}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    fontSize: "10px",
                    padding: "4px"
                  }}
                >
                  <View
                    style={{
                      flexBasis: "35%"
                    }}
                  >
                    <Text style={[style.label, { textAlign: "left" }]}>
                      Número de marcado de llantas de tractor
                    </Text>
                  </View>
                  <View style={{ flexBasis: "35%" }}>
                    <Text style={style.underline}>
                      {inspection.tiresVehicle}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    fontSize: "10px",
                    padding: "4px"
                  }}
                >
                  <View
                    style={{
                      flexBasis: "35%"
                    }}
                  >
                    <Text style={[style.label, { textAlign: "left" }]}>
                      Número de marcado de llantas de remolque
                    </Text>
                  </View>
                  <View style={{ flexBasis: "35%" }}>
                    <Text style={style.underline}>
                      {inspection.tiresContainer}
                    </Text>
                  </View>
                </View>

                {/* Signatures */}
                <View
                  style={{
                    flex: 2,
                    flexDirection: "row",
                    fontSize: "10px",
                    justifyContent: "space-between",
                    padding: "4px"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-start"
                    }}
                  >
                    <Text style={style.signature}>
                      {inspection.approvedBy?.user.name}
                    </Text>
                    <Text style={style.td}>Nombre y firma del Supervisor</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={style.signature}>
                      {inspection.inspectedBy.user.name}
                    </Text>
                    <Text style={style.td}>
                      Nombre y firma de quien realizó la inspección
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}
