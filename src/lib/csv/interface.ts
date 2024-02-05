import {  FormatterRow} from 'fast-csv';

export interface ICsvType {
    path: string
    writeOpts: Record<string,any>
    /**
     * @function 初始化创建csv文件
     * @param rows 
     */
    create(rows: FormatterRow[]): Promise<void>
    /**
     * @function 已有csv文件，动态增加内容
     * @param rows 
     */
    append(rows: FormatterRow[]): Promise<void>
    /**
     * @function 读取csv文件内容，默认Buffer
     */
    read(): Promise<Buffer>
    /**
     * @function 读取csv文件内容，解析json内容
     */
    readJson(): Promise<Record<string, any>[]>
}