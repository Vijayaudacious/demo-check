export default {
  title: "All Categories",
  list: {
    columns: {
      name: "Name",
      description: "Description",
      createdBy: "Created By",
      createdAt: "Created At",
      updatedAt: "Updated At",
      action: "Action",
    },
    tooltipTitle: {
      update: "Update",
      delete: "Delete",
    },
    searchPlaceholder: "Search by name",
    deleteModal: {
      title: "Do you want to delete this category?",
      message: {
        success: "Category deleted successfully",
      },
    },
  },
  form: {
    title: {
      create: "Create Category",
      update: "Update Category",
    },
    label: {
      name: {
        label: "Name",
        required: "Please enter name",
        placeholder: "Category name",
      },
      description: {
        label: "Description",
        placeholder: "Description",
        required: "Please enter description",
      },
    },
    messages: {
      created: { success: "Category created successfully" },
      updated: { success: "Category updated successfully" },
    },
  },
};
