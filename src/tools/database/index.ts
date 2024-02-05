import { DataSource, Like } from "typeorm"
import { sqlitePath } from 'Tools/utils/paths'
import { Project, RepoType, ProjectType } from './entity/Project'
import { Link } from "./entity/Link"
import { AsyncModule } from './entity/AsyncModule'

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: sqlitePath,
    entities: [Project, Link, AsyncModule],
    synchronize: true,
    logging: false,
})
AppDataSource.initialize()
.then(async connection => {
    // console.log("Connection initialized with database...");
    // here you can start to work with your database
})
.catch((error) => console.log(error))

/**
 * @function 获取DataSource
 * @param delay 获取实例的延迟
 * @returns Promise<DataSource>
 */
export const getDataSource = (delay = 1000): Promise<DataSource> => {
    if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (AppDataSource.isInitialized) resolve(AppDataSource);
        else reject("Failed to create connection with database");
      }, delay);
    });
};


export { Project, RepoType, ProjectType, Link, AsyncModule, DataSource, Like }