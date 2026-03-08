import { aggregateAllNews } from './src/lib/pipeline/aggregator';

async function main() {
  console.log('--- Aggregation Test Start ---');
  try {
    const { items, errors } = await aggregateAllNews();
    console.log(`\n✅ Aggregation Success!`);
    console.log(`📊 Total Items: ${items.length}`);
    console.log(`⚠️ Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Sample Error:', errors[0]);
    }
  } catch (error) {
    console.error('Test Failed:', error);
  }
  console.log('--- Aggregation Test End ---');
}

main();
