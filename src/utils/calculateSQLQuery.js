const calculateSQLQuery = (booleanQueryInstance, question, selectedDatasource) => {
  let SQLQuery = {};
  // Calculate SQL for the currently open question
  const openedQuestion = question;
  const nodeList = openedQuestion.nodes;

  SQLQuery = { select: [], from: [], where: [], join: [], join_on: [] };

  nodeList.forEach((node, index) => {
    if (node.visibleColumns && node.visibleColumns.length > 0 && node.collection !== '') {
      // if the user picked columns we only show the ones they selected
      const fullyQualifiedColumnNames = [];
      node.visibleColumns.forEach((column) => {
        fullyQualifiedColumnNames.push(
          `"${node.collection}"."${column}" as "${node.collection} ${column}"`,
        );
      });

      SQLQuery.select.push(fullyQualifiedColumnNames.join(', '));
    } else if (node.collection !== '') {
      // otherwise we show all (*)

      const { schema } = selectedDatasource;
      if (index === 0) {
        console.log(schema);
      }
      schema[node.collection].direct_fields.forEach((fieldEntry) => {
        SQLQuery.select.push(
          `"${node.collection}".` +
            `"${Object.keys(fieldEntry)[0]}" as "${node.collection} ${Object.keys(fieldEntry)[0]}"`,
        );
      });
      // SQLQuery['select'].push("\"" + node.collection + "\".*");
    }

    if (node.collection !== '') {
      SQLQuery.from.push(`"${node.collection}"`);
      if (node.booleanQuery) {
        SQLQuery.where.push(node.booleanQuery);
      }
    }

    switch (node.operation) {
      case 'list of': // collect selected tables and their columns and filters - done
        break;

      case 'average':
        SQLQuery.select = [`AVG("${node.collection}"."${node.selectedField}")`];
        break;

      case 'number of(unique)':
        SQLQuery.select = [`COUNT(DISTINCT("${node.collection}"."${node.selectedField}"))`];
        break;

      case 'total':
        SQLQuery.select = [`SUM("${node.collection}"."${node.selectedField}")`];
        break;

      case 'group by':
        SQLQuery['group by'] = {};
        SQLQuery['group by'].categories = [`GROUP BY "${node.collection}"."${node.selectedField}"`];
        if (!node.groupByAggregations) {
          // eslint-disable-next-line no-param-reassign
          node.groupByAggregations = [];
        }
        SQLQuery['group by'].aggregations = node.groupByAggregations.concat([
          ` "${node.collection}"."${node.selectedField}" `,
        ]);
        break;

      default:
        break;
    }

    if (index > 0 && node.collection) {
      const prevNode = nodeList[index - 1];
      const prevNodePk = selectedDatasource.schema[prevNode.collection]
        ? selectedDatasource.schema[prevNode.collection].primary_key
        : '';
      const currentNodePk = selectedDatasource.schema[node.collection]
        ? selectedDatasource.schema[node.collection].primary_key
        : '';
      // here comes the juicy part
      switch (node.operation) {
        case 'list of': // we want a join on the relational column
          SQLQuery.join.push(node.collection);

          // If we got to the current table via an INBOUND relationship e.g. customers -> orders
          // use the prev table.pk joined on
          // current table[.]prev table inbound relationships of current table
          if (
            selectedDatasource.schema[prevNode.collection].inbound_relationships &&
            selectedDatasource.schema[prevNode.collection].inbound_relationships
              .map((ir) => Object.keys(ir)[0])
              .includes(node.collection)
          ) {
            SQLQuery.join_on.push(` ON "${prevNode.collection}"."${prevNodePk}"`);
            SQLQuery.join_on.push(
              ` = ` +
                `"${node.collection}"."${Object.values(
                  selectedDatasource.schema[prevNode.collection].inbound_relationships.filter(
                    (rel) => node.collection in rel,
                  )[0],
                )}"`,
            );
          } else {
            // We got to the current table via an OUTBOUND relationship e.g. orders -> customers
            // use the prev table [.] prev table outbound relationships of current one joined on
            // current table [.] current table pk
            console.log(selectedDatasource.schema[prevNode.collection].outbound_relationships);
            SQLQuery.join_on.push(
              ` ON ` +
                `"${prevNode.collection}"."${Object.values(
                  selectedDatasource.schema[prevNode.collection].outbound_relationships.filter(
                    (rel) => node.collection in rel,
                  )[0],
                )}"`,
            );
            SQLQuery.join_on.push(` = "${node.collection}"."${currentNodePk}"`);
          }
          break;

        case 'group by':
          // We did the work above, we just need to generate the query itself
          break;

        default:
          break;
      }
    }
  });

  // Generate the SELECT fields - if we have GROUP BY we remove the requested fields and only show aggregated fields instead
  if (SQLQuery['group by'] && SQLQuery['group by'].aggregations) {
    SQLQuery.select = SQLQuery['group by'].aggregations.map(
      (agg) => `${agg} as "${agg.replaceAll('"', '')}"`,
    );
  }

  let localCalculatedQuery = `SELECT ${SQLQuery.select.join(', ')} FROM ${SQLQuery.from[0]}`;

  // Then the JOIN section
  SQLQuery.join.forEach((fragment, index) => {
    localCalculatedQuery += ` JOIN "${fragment}" ${SQLQuery.join_on[2 * index]}${
      SQLQuery.join_on[2 * index + 1]
    }`;
  });

  // And finally the WHERE section
  if (booleanQueryInstance) {
    // TODO: do we actually even need this check anymore?
    if (SQLQuery.where.length > 0 && SQLQuery.where[0].rules.length > 0) {
      localCalculatedQuery += ' WHERE (';
      localCalculatedQuery += `${SQLQuery.where
        .map((filterNode) => booleanQueryInstance.getSqlFromRules(filterNode))
        .join(') AND (')})`;
    }
    if (SQLQuery['group by']) {
      // We just need to add GROUP BY at the end
      localCalculatedQuery += SQLQuery['group by'].categories;
    }
  }

  localCalculatedQuery = localCalculatedQuery
    .replaceAll('/|\\', '"')
    .replaceAll('AND ()', '')
    .replaceAll('WHERE ()', '');

  return localCalculatedQuery;
};

export default calculateSQLQuery;
