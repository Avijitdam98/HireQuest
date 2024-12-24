import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  Text,
  Button,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSearch, FaBriefcase, FaUsers, FaUserFriends } from 'react-icons/fa';
import useSearchStore from '../../store/useSearchStore';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import RecommendationCard from '../recommendations/RecommendationCard';

const SearchPage = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const {
    searchJobs,
    searchProfiles,
    searchTeams,
    getJobRecommendations,
    getTeamRecommendations,
    searchResults,
    recommendations,
    loading,
    error
  } = useSearchStore();

  const [searchType, setSearchType] = useState('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience_level: '',
    type: '',
    salary_min: 0,
    salary_max: 200000,
    skills: [],
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  }, [error, toast]);

  useEffect(() => {
    getJobRecommendations();
    getTeamRecommendations();
  }, []);

  const handleSearch = async () => {
    const params = {
      ...filters,
      search: searchQuery
    };

    switch (searchType) {
      case 'jobs':
        await searchJobs(params);
        break;
      case 'profiles':
        await searchProfiles(params);
        break;
      case 'teams':
        await searchTeams(params);
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      experience_level: '',
      type: '',
      salary_min: 0,
      salary_max: 200000,
      skills: [],
      sort_by: 'created_at',
      sort_order: 'desc'
    });
  };

  const handleItemClick = (item) => {
    // Handle navigation to detail page based on type
    console.log('Clicked item:', item);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <Grid templateColumns="repeat(12, 1fr)" gap={8}>
          {/* Filters */}
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </GridItem>

          {/* Main Content */}
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box mb={6}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search jobs, people, or teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </InputGroup>
            </Box>

            <Tabs onChange={(index) => setSearchType(['jobs', 'profiles', 'teams'][index])}>
              <TabList mb={4}>
                <Tab><HStack><FaBriefcase /><Text>Jobs</Text></HStack></Tab>
                <Tab><HStack><FaUsers /><Text>People</Text></HStack></Tab>
                <Tab><HStack><FaUserFriends /><Text>Teams</Text></HStack></Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <SearchResults
                    results={searchResults}
                    type="jobs"
                    loading={loading}
                    onItemClick={handleItemClick}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <SearchResults
                    results={searchResults}
                    type="profiles"
                    loading={loading}
                    onItemClick={handleItemClick}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <SearchResults
                    results={searchResults}
                    type="teams"
                    loading={loading}
                    onItemClick={handleItemClick}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          {/* Recommendations */}
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              shadow="sm"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Recommended for You
              </Text>
              <VStack spacing={4}>
                {recommendations.map((item) => (
                  <RecommendationCard
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchPage;
