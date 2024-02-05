import * as fs from 'fs';
import { FormatterOptionsArgs, FormatterRow, writeToStream , parseFile} from 'fast-csv';

import { injectable } from 'IOC/index'
import { ICsvType } from './interface'


type CsvFileOpts = {
    headers: string[];
};

@injectable()
export class CsvFile<T extends CsvFileOpts> implements ICsvType {
    static write(stream: NodeJS.WritableStream, rows: FormatterRow[], options: FormatterOptionsArgs<FormatterRow, FormatterRow>): Promise<void> {
        return new Promise((res, rej) => {
            writeToStream(stream, rows, options)
                .on('error', (err: Error) => rej(err))
                .on('finish', () => res());
        });
    }

    public path: string = process.cwd()

    public writeOpts: T = Object.create({})

    create(rows: FormatterRow[]): Promise<void> {
        return CsvFile.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts });
    }

    append(rows: FormatterRow[]): Promise<void> {
        return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
            ...this.writeOpts,
            writeHeaders: false,
        } as FormatterOptionsArgs<FormatterRow, FormatterRow>);
    }

    read(): Promise<Buffer> {
        return new Promise((res, rej) => {
            fs.readFile(this.path, (err, contents) => {
                if (err) {
                    return rej(err);
                }
                return res(contents);
            });
        });
    }

    readJson(): Promise<Record<string, any>[]> {
        const headers = this.writeOpts.headers || true

        return new Promise((res, rej) => {
            const tempArr = []

            parseFile(this.path, {...this.writeOpts, headers })
            .on('error', error => rej(error))
            .on('data', row => {
                tempArr.push(row)
            })
            .on('end', () => res(tempArr));
        });
    }
}