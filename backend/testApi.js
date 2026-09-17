import axios from 'axios';

async function run() {
  try {
    // 1. Get a product to check reviews
    const prodRes = await axios.get('http://localhost:8080/product/viewall');
    let prods = prodRes.data.data;
    if (!prods.length) { console.log('No products'); return; }

    let reviewId = null;
    for (let p of prods) {
      const revs = await axios.get(`http://localhost:8080/review/product/${p._id}`);
      if (revs.data.data && revs.data.data.length > 0) {
        reviewId = revs.data.data[0]._id;
        console.log('Found review:', reviewId);
        break;
      }
    }

    if (!reviewId) {
      console.log('No reviews found to test');
      return;
    }

    // Try an invalid token to see if it responds
    try {
      await axios.put(`http://localhost:8080/review/update/${reviewId}`, {
        rating: 4,
        comment: "updated"
      }, {
        headers: { Authorization: "Bearer badtoken" }
      });
    } catch(err) {
      console.log('Update Error with bad token:', err.response?.data);
    }
  } catch(e) {
    console.log(e);
  }
}
run();
