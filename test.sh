#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
COMPOSE_FILE='./docker-compose-test.yml'

docker-compose --file=${COMPOSE_FILE} run tests npm test
docker logs tests

if [ -z ${TEST_EXIT_CODE+x} ] || [ "$TEST_EXIT_CODE" -ne 0 ]  ; then
  printf "${RED}Tests Failed${NC} - Exit Code: $TEST_EXIT_CODE\n"
else
  printf "${GREEN}Tests Passed in ${WAIT_FOR}${NC}\n\n"
fi

exit $TEST_EXIT_CODE
