import type { ITag } from "@tago-io/tcore-sdk/types";
import FormDivision from "../FormDivision/FormDivision.tsx";
import { EIcon } from "../Icon/Icon.types";
import Tags from "./Tags.tsx";

/**
 * Props.
 */
interface ITagsTabProps {
  /**
   * Name for this tab.
   */
  name?: string;
  /**
   * The tags to be rendered.
   */
  data?: ITag[];
  /**
   * Tags' errors.
   */
  errors?: any;
  /**
   * Called when a tag field has changed.
   */
  onChange: (tags: ITag[]) => void;
  /**
   * Doesn't allow editing or adding new tags.
   */
  disabled?: boolean;
}

/**
 * This is the tags tab in an edit page.
 * It shows a title and the tags component below the title.
 */
function TagsTab(props: ITagsTabProps) {
  const { data, disabled, errors, name } = props;

  return (
    <div>
      <FormDivision
        icon={EIcon.tag}
        title="Tags"
        description={`Tags are a way of organizing your ${name}, they appear as custom columns in the list.`}
      />
      <Tags disabled={disabled} errors={errors} data={data || []} onChange={props.onChange} />
    </div>
  );
}

export default TagsTab;
