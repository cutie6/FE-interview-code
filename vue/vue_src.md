# vue源码

## Element.attributes 
Element.attributes 属性返回该元素所有属性节点的一个实时集合(包括自定义属性 v-for v-if 等)。该集合是一个 NamedNodeMap 对象，不是一个数组，所以它没有数组的方法，其包含的属性节点的索引顺序随浏览器不同而不同。更确切地说，attributes 是字符串形式的名/值对，每一对名/值对对应一个属性节点。