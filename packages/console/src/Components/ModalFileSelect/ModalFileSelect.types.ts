/**
 * Represents a file or a folder.
 */
export interface IFile {
  /**
   * Local name, excluding the full path.
   */
  name: string;
  /**
   * Full path of the file, including the name.
   */
  path: string;
  /**
   * Indicates if this file is a folder or not.
   */
  is_folder: boolean;
  /**
   * If the file is a folder this will contain the files inside of the folder.
   * If the file is not a folder this will always be empty.
   */
  children: IFile[];
}
