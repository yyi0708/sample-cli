import { DataSource } from "typeorm"
import { sqlitePath } from 'Tools/utils/paths'
import { Project } from './entity/Project'

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: sqlitePath,
    entities: [Project],
    synchronize: true,
    logging: false,
})
AppDataSource.initialize()
.then(() => {
    console.log("Connection initialized with database...");
    // here you can start to work with your database
})
.catch((error) => console.log(error))

export const getDataSource = (delay = 3000): Promise<DataSource> => {
    if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (AppDataSource.isInitialized) resolve(AppDataSource);
        else reject("Failed to create connection with database");
      }, delay);
    });
};

// export { Link } from './entity/Link'

export { Project, RepoType, ProjectType } from './entity/Project'