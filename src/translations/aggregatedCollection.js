import MapCollection from './mapCollection';
import { arrayMap } from '../helpers/array';
import { rangeEach } from '../helpers/number';
import { isDefined } from '../helpers/mixed';

/**
 * Collection of maps. This collection aggregate maps with the same type of values. Values from the registered maps
 * can be used to calculate a single result for particular index.
 */
class AggregatedCollection extends MapCollection {
  constructor(aggregationFunction, fallbackValue) {
    super();

    this.mergedValuesCache = [];
    this.aggregationFunction = aggregationFunction;
    this.fallbackValue = fallbackValue;
  }

  /**
   * Get merged values for all indexes.
   *
   * @param {boolean} [readFromCache=true] Determine if read results from the cache.
   * @returns {Array}
   */
  getMergedValues(readFromCache = true) {
    if (readFromCache === true) {
      return this.mergedValuesCache;
    }

    if (this.getLength() === 0) {
      return [];
    }

    // Below variable stores values for every particular map. Example describing situation when we have 2 registered maps,
    // with length equal to 5.
    //
    // +---------+---------------------------------------------+
    // |         |                  indexes                    |
    // +---------+---------------------------------------------+
    // |   maps  |     0    |   1   |    2  |   3   |    4     |
    // +---------+----------+-------+-------+-------+----------+
    // |    0    | [[ value,  value,  value,  value,  value ], |
    // |    1    | [  value,  value,  value,  value,  value ]] |
    // +---------+----------+-------+-------+-------+----------+
    const mapsValuesMatrix = arrayMap(this.get(), map => map.getValues());
    // Below variable stores values for every particular index. Example describing situation when we have 2 registered maps,
    // with length equal to 5.
    //
    // +---------+---------------------+
    // |         |         maps        |
    // +---------+---------------------+
    // | indexes |     0    |    1     |
    // +---------+----------+----------+
    // |    0    | [[ value,  value ], |
    // |    1    | [  value,  value ], |
    // |    2    | [  value,  value ]] |
    // |    3    | [  value,  value ]] |
    // |    4    | [  value,  value ]] |
    // +---------+----------+----------+
    const indexesValuesMatrix = [];
    const mapsLength = (isDefined(mapsValuesMatrix[0]) && mapsValuesMatrix[0].length) || 0;

    rangeEach(mapsLength - 1, (index) => {
      const valuesForIndex = [];

      rangeEach(this.getLength() - 1, (mapIndex) => {
        valuesForIndex.push(mapsValuesMatrix[mapIndex][index]);
      });

      indexesValuesMatrix.push(valuesForIndex);
    });

    return arrayMap(indexesValuesMatrix, this.aggregationFunction);
  }

  /**
   * Get merged value for particular index.
   *
   * @param {number} index Index for which we calculate single result.
   * @param {boolean} [readFromCache=true] Determine if read results from the cache.
   * @returns {*}
   */
  getMergedValueAtIndex(index, readFromCache) {
    const valueAtIndex = this.getMergedValues(readFromCache)[index];

    return isDefined(valueAtIndex) ? valueAtIndex : this.fallbackValue;
  }

  /**
   * Rebuild cache for the collection.
   */
  updateCache() {
    this.mergedValuesCache = this.getMergedValues(false);
  }
}

export default AggregatedCollection;
