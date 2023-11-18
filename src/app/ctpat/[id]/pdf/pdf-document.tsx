"use client"

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

const style = StyleSheet.create({
  header: {
    flexBasis: "60px",
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
    marginLeft: "4px"
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
  }
})

export default function PDFDocument() {
  return (
    <Document>
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
              <View style={{ flexBasis: "20%" }}></View>
              <View
                style={{
                  flex: 1,
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontSize: "14px"
                }}
              >
                <Text>Inspección de los 17 puntos críticos</Text>
              </View>
              <View style={{ flexBasis: "20%" }}></View>
            </View>
            {/* Master */}
            <View
              style={{
                flex: 1,
                fontSize: "8px",
                flexDirection: "column",
                justifyContent: "flex-start",
                padding: "10px",
                borderBottom: "1px solid black"
              }}
            >
              <View style={style.row}>
                <View style={style.block}>
                  <Text style={style.label}>Fecha de ingreso:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>Fecha de salida:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>Ingresa cargado:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View style={style.row}>
                <View style={style.block}>
                  <Text style={style.label}>Hora entrada:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>Hora salida:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>Ingresa vacío:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View style={style.row}>
                <View style={[style.block, { flexBasis: "28%" }]}>
                  <Text style={style.label}>Transportista:</Text>
                  <Text style={[style.underline, { flexBasis: "35%" }]}>
                    #Valor
                  </Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>No. Tractor:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>No. Remolque:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View style={style.row}>
                <View style={style.block}>
                  <Text style={style.label}>Nombre Operador:</Text>
                  <Text style={[style.underline, { flexBasis: "35%" }]}>
                    #Valor
                  </Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>Placas:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View style={style.row}>
                <View style={style.block}>
                  <Text style={style.label}>Firma Operador:</Text>
                  <Text style={[style.underline, { flexBasis: "35%" }]}>
                    #Valor
                  </Text>
                </View>
                <View style={style.block}>
                  <Text style={style.label}>No. Licencia:</Text>
                  <Text style={style.underline}>#Valor</Text>
                </View>
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
                  <Text style={style.td}>#Pregunta</Text>
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
                      <Text style={style.td}>#Resultado</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={style.td}>#Comentarios</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Extra Info */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "yellow",
                  fontSize: "10px"
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
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "yellow",
                  fontSize: "10px"
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
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "yellow",
                  fontSize: "10px"
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
                  <Text style={style.underline}>#Valor</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
