export type IBlogFilters = {
  searchTerm?: string;
  slug?: string;
  tag?: string;
  status?: string;
};

export type ITagItem = {
  blog_id: string;
  tag_id: string;
};
