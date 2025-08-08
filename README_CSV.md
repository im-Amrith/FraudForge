# Sample Transaction CSV File

This CSV file contains sample transaction data that can be used with the FraudForge AI Transaction Manager.

## File Information

- **Filename**: `sample_transactions.csv`
- **Records**: 30 sample transactions
- **Date Range**: January 15-16, 2024
- **Format**: CSV (Comma-Separated Values)

## Expected Columns

The CSV file includes all the required columns for the Transaction Manager:

1. **trans_date_trans_time** - Transaction date and time (YYYY-MM-DD HH:MM:SS)
2. **cc_num** - Credit card number (16 digits)
3. **merchant** - Merchant name
4. **category** - Transaction category
5. **amt** - Transaction amount (decimal)
6. **first** - Customer first name
7. **last** - Customer last name
8. **gender** - Customer gender (M/F)
9. **street** - Customer street address
10. **city** - Customer city
11. **state** - Customer state
12. **zip** - Customer ZIP code
13. **lat** - Customer latitude
14. **long** - Customer longitude
15. **city_pop** - City population
16. **job** - Customer job title
17. **dob** - Customer date of birth (YYYY-MM-DD)
18. **trans_num** - Transaction number
19. **unix_time** - Unix timestamp
20. **merch_lat** - Merchant latitude
21. **merch_long** - Merchant longitude

## Sample Data Features

### Transaction Categories
- **shopping_pos** - In-store shopping (Target, Walmart, Best Buy)
- **online_pos** - Online purchases (Amazon)
- **food_dining** - Food and dining (Starbucks, McDonald's, Chipotle)
- **gas_transport** - Gas stations and transportation (Shell, Exxon, BP)
- **entertainment** - Entertainment services (Netflix, Spotify)
- **transportation** - Transportation services (Uber)
- **home** - Home improvement (Home Depot)

### Transaction Amounts
- **Range**: $8.75 - $1,299.99
- **Average**: ~$150
- **Distribution**: Mix of small, medium, and large transactions

### Geographic Coverage
- **Cities**: 30 major US cities
- **States**: 25 different states
- **Population**: Various city sizes (633K - 8.3M)

### Customer Demographics
- **Age Range**: 1980-1993 (31-44 years old)
- **Gender**: Balanced mix of male and female customers
- **Professions**: Various professional backgrounds

## How to Use

1. **Upload to Transaction Manager**:
   - Navigate to the Transaction Manager in your FraudForge AI dashboard
   - Select the "CSV Upload" tab
   - Click "Choose file" and select `sample_transactions.csv`
   - Click "Parse Data" to process the file

2. **Data Processing**:
   - The system will automatically parse the CSV data
   - Risk scores will be calculated based on transaction amounts and patterns
   - Suspicious transactions will be flagged for review

3. **Expected Results**:
   - 30 transactions will be processed
   - High-value transactions (>$500) may be flagged as suspicious
   - Risk scores will be calculated automatically
   - Transactions will appear in the dashboard for monitoring

## Data Quality

- **Realistic Data**: All data is realistic and follows proper formats
- **No Sensitive Information**: Credit card numbers are fictional
- **Geographic Accuracy**: Coordinates match actual city locations
- **Temporal Consistency**: Timestamps are sequential and realistic

## Customization

You can modify this CSV file to:
- Add more transactions
- Change transaction amounts
- Modify customer information
- Add different merchant categories
- Adjust geographic locations

## Support

If you encounter any issues with the CSV file:
1. Ensure the file is saved in UTF-8 encoding
2. Verify all required columns are present
3. Check that date formats are correct (YYYY-MM-DD)
4. Ensure numeric values don't contain currency symbols

## Security Note

This sample data is for testing purposes only. In production:
- Use real transaction data
- Ensure proper data encryption
- Follow PCI DSS compliance guidelines
- Implement proper access controls
