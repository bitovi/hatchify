# Adding forms to the list

Although Hatchify does not currently provide out-of-the-box components for forms, it does provide the tools to make it easy to add them to your application. This guide will walk you through the process of adding form-like behavior to the list we created in the [getting started guide](../../README.md). For the sake of simplicity, we will put our add and edit forms in modals on the same page as the list. If your application already has routing, you may want to create separate pages for the forms.

## Prerequisites

This guide assumes you have already completed the [getting started guide](../../README.md).

## Adding a todo

Before we get started on the form for adding a todo, we need to add a modal component to our application and a button to open it. We will use the [react-modal](https://mui.com/material-ui/react-modal/) from Material UI.
