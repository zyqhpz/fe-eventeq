import React from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer'

import EventEQLogo from '../../../../src/assets/EventEQ.png'

const tailwindStyles = {
  textBase: { fontSize: 12 }, // Tailwind's base text size
  textLg: { fontSize: 16 }, // Tailwind's large text size
  fontBold: { fontWeight: 'bold' }
  // ... Add more mappings as needed
}

// Register font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Regular.ttf'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Bold.ttf',
      fontWeight: 'bold'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Italic.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-BoldItalic.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Light.ttf',
      fontWeight: 'light'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Medium.ttf',
      fontWeight: 'medium'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    fontFamily: 'Roboto'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 70,
    height: 70
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  infoText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12
  },
  table: {
    display: 'table',
    width: '100%',
    margin: 'auto',
    fontSize: 12
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 5
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  totalLabel: {
    flex: 1,
    fontWeight: 'bold'
  },
  totalValue: {
    flex: 1,
    textAlign: 'right'
  },
  thankYou: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center'
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  label: {
    fontWeight: 'bold'
  }
})

const MyDocument = () => {
  // Extract the bookingId from the URL
  const pathParts = window.location.pathname.split('/')
  const bookingId = pathParts[pathParts.indexOf('booking') + 1]

  // Sample data
  const fromWhom = 'Your Company'
  const toWhom = 'Customer Name'
  const items = [
    { itemName: 'Item 1', quantity: 2, price: 50, total: 0 },
    { itemName: 'Item 2', quantity: 1, price: 30, total: 0 }
  ]

  // calculate the total price of all items and update in the items array
  items.forEach((item) => {
    item.total = item.quantity * item.price
  })

  const grandTotal = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image src={EventEQLogo} style={styles.logo} />
            <Text style={styles.title}>Invoice</Text>
          </View>

          <View
            style={[
              {
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                fontSize: 12,
                marginBottom: 10,
                marginTop: 10
              }
            ]}
          >
            <Text>
              <Text
                style={{
                  fontWeight: 'bold'
                }}
              >
                Booking ID:
              </Text>{' '}
              {bookingId}
            </Text>
            <Text>
              <Text
                style={{
                  fontWeight: 'bold'
                }}
              >
                Date:
              </Text>{' '}
              12/12/2020
            </Text>
          </View>

          {/* From and To Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoText}>
              <Text style={styles.header}>From:</Text>
              <Text style={tailwindStyles.textSm}>{fromWhom}</Text>
              <Text style={tailwindStyles.textSm}>Email</Text>
              <Text style={tailwindStyles.textSm}>No. Phone</Text>
            </View>
            <View style={styles.infoText}>
              <Text style={styles.header}>To:</Text>
              <Text style={tailwindStyles.textSm}>{toWhom}</Text>
              <Text style={tailwindStyles.textSm}>Email</Text>
              <Text style={tailwindStyles.textSm}>No. Phone</Text>
            </View>
          </View>

          {/* Table for Details */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Item Name</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Quantity</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Price</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Total</Text>
              </View>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}>
                  <Text>{item.itemName}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    RM&nbsp;
                    {
                      // Format the price to 2 decimal places
                      parseFloat(item.price).toFixed(2)
                    }
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    RM&nbsp;
                    {
                      // Format the total to 2 decimal places
                      parseFloat(item.total).toFixed(2)
                    }
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{grandTotal}</Text>
          </View>
          {/* Thank You */}
          <Text style={styles.thankYou}>Thank you for choosing us!</Text>
        </View>
      </Page>
    </Document>
  )
}

export default MyDocument
