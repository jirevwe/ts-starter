import { injectable, unmanaged } from 'inversify';
import mongoose, { Model, Schema, FilterQuery } from 'mongoose';
import { DuplicateModelError, ModelNotFoundError } from '.';
import { Repository, Query, QueryResult, PaginationQuery } from '.';

@injectable()
export class BaseRepository<T> implements Repository<T> {
  protected model: Model<T>;
  constructor(@unmanaged() private name: string, @unmanaged() schema: Schema) {
    this.model = mongoose.model<T>(name, schema);
  }

  /**
   * checks if the archived argument is either undefined
   * or passed as a false string in the cause of query params, and
   * converts it to a boolean.
   * @param archived string or boolean archived option
   */
  convertArchived = (archived: string | boolean) =>
    archived === undefined || archived === 'false' ? false : true;

  /**
   * Converts a passed condition argument to a query
   * @param condition string or object condition
   */
  getQuery = (condition: string | object): FilterQuery<any> => {
    return typeof condition === 'string'
      ? { _id: condition }
      : { ...condition };
  };

  /**
   * Creates one or more documets.
   */
  create(attributes: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model.create(
        attributes,
        (err: { code: number }, result: T | PromiseLike<T>) => {
          if (err && err.code === 11000)
            return reject(
              new DuplicateModelError(`${this.name} exists already`)
            );
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  /**
   * Finds a document by it's id
   * @param _id
   * @param projections
   * @param archived
   */
  byID(_id: string, projections?: any, archived?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      archived = this.convertArchived(archived);
      const query: FilterQuery<any> = {
        _id,
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } })
      };
      this.model
        .findOne(query)
        .select(projections)
        .exec((err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          resolve(result);
        });
    });
  }

  /**
   * Finds a document by an object query.
   * @param query
   * @param projections
   * @param archived
   */
  async byQuery(query: any, projections?: any, archived?: boolean | string) {
    archived = this.convertArchived(archived);
    return this.model
      .findOne({
        ...query,
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } })
      })
      .select(projections);
  }

  /**
   * Finds all documents that match a query
   * @param query
   */
  all(query: Query): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const sort = query.sort || 'created_at';
      this.model
        .find({
          ...query.conditions,
          deleted_at: undefined
        })
        .select(query.projections)
        .sort(sort)
        .exec((err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  }

  /**
   * Same as `all()` but returns paginated results.
   * @param query Query
   */
  list(query: PaginationQuery): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      const page = Number(query.page) - 1 || 0;
      const per_page = Number(query.per_page) || 20;
      const offset = page * per_page;
      const sort = query.sort || 'created_at';
      const archived = this.convertArchived(query.archived);
      this.model
        .find({
          ...query.conditions,
          ...(!archived
            ? { deleted_at: undefined }
            : { deleted_at: { $ne: undefined } })
        })
        .limit(per_page)
        .select(query.projections)
        .skip(offset)
        .sort(sort)
        .exec((err, result) => {
          if (err) return reject(err);
          const queryResult = {
            page: page + 1,
            per_page,
            sort,
            result
          };
          resolve(queryResult);
        });
    });
  }

  /**
   * Updates a single document that matches a particular condition.
   * Triggers mongoose `save` hooks.
   * @param condition
   * @param update
   */
  update(condition: string | object, update: any): Promise<T> {
    const query = this.getQuery(condition);

    return new Promise((resolve, reject) => {
      this.model.findOne(
        query,
        (
          err: any,
          result: {
            set: (arg0: any) => void;
            save: (arg0: (err: any, updatedDocument: any) => void) => void;
          }
        ) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          result.set(update);
          result.save((err: any, updatedDocument: T | PromiseLike<T>) => {
            if (err) return reject(err);
            resolve(updatedDocument);
          });
        }
      );
    });
  }

  /**
   * Allows the user of atomic operators such as $inc in updates.
   * Note: It does not trigger mongoose `save` hooks.
   * @param condition Query condition to match against documents
   * @param update The document update
   */
  updateWithOperators(condition: string | object, update: any): Promise<T> {
    const query = this.getQuery(condition);

    return new Promise((resolve, reject) => {
      this.model.findOneAndUpdate(
        query,
        update,
        { new: true },
        (err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          resolve(result);
        }
      );
    });
  }

  /**
   * Updates multiple documents that match a query
   * @param condition
   * @param update
   */
  updateAll(condition: string | object, update: any): Promise<T[]> {
    const query = this.getQuery(condition);

    return new Promise((resolve, reject) => {
      this.model.updateMany(query, update, {}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Soft deletes a document by created `deleted_at` field in the document and setting it to true.
   * @param condition
   */
  remove(condition: string | object): Promise<T> {
    return new Promise((resolve, reject) => {
      const query: FilterQuery<any> = this.getQuery(condition);
      const updateQuery: any = {
        deleted_at: new Date()
      };
      const opt = {
        new: true
      };
      this.model.findOneAndUpdate(query, updateQuery, opt, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(new ModelNotFoundError(`${this.name} not found`));
        resolve(result);
      });
    });
  }

  /**
   * Permanently deletes a document by removing it from the collection(DB)
   * @param condition
   */
  destroy(condition: string | object): Promise<T> {
    return new Promise((resolve, reject) => {
      const query = this.getQuery(condition);

      this.model.findOneAndDelete(query, {}, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(new ModelNotFoundError(`${this.name} not found`));
        resolve(result);
      });
    });
  }
}
