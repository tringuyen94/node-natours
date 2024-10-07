class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let queryObj = { ...this.queryString };
    const excludeQuery = ['page', 'sort', 'limit', 'fields'];
    excludeQuery.forEach((ele) => delete queryObj[ele]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('--createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');

      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
