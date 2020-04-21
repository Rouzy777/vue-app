<template>
    <Table />
</template>

<script>
import Table from "@/components/Table";
export default {
    name: "app",
    components: {
        Table
    }
};
</script>

<style>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px 40px;
}
</style>
