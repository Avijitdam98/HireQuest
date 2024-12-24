import React from 'react';
import {
  Box,
  Stack,
  Select,
  Input,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Checkbox,
  CheckboxGroup,
  VStack,
  HStack,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

const SearchFilters = ({ filters, onChange, onReset }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Stack spacing={4}>
        <Box>
          <Text mb={2} fontWeight="medium">Location</Text>
          <Input
            placeholder="Enter location"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Experience Level</Text>
          <Select
            value={filters.experience_level || ''}
            onChange={(e) => handleChange('experience_level', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </Select>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Job Type</Text>
          <Select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </Select>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Salary Range</Text>
          <RangeSlider
            defaultValue={[filters.salary_min || 0, filters.salary_max || 200000]}
            min={0}
            max={200000}
            step={10000}
            onChange={([min, max]) => {
              handleChange('salary_min', min);
              handleChange('salary_max', max);
            }}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <HStack justify="space-between" mt={2}>
            <Text fontSize="sm">${filters.salary_min?.toLocaleString() || 0}</Text>
            <Text fontSize="sm">${filters.salary_max?.toLocaleString() || '200k+'}</Text>
          </HStack>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Skills</Text>
          <CheckboxGroup
            value={filters.skills || []}
            onChange={(value) => handleChange('skills', value)}
          >
            <VStack align="start">
              <Checkbox value="javascript">JavaScript</Checkbox>
              <Checkbox value="python">Python</Checkbox>
              <Checkbox value="react">React</Checkbox>
              <Checkbox value="node">Node.js</Checkbox>
              <Checkbox value="java">Java</Checkbox>
              <Checkbox value="sql">SQL</Checkbox>
              <Checkbox value="aws">AWS</Checkbox>
              <Checkbox value="docker">Docker</Checkbox>
            </VStack>
          </CheckboxGroup>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">Sort By</Text>
          <Select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleChange('sort_by', e.target.value)}
          >
            <option value="created_at">Date Posted</option>
            <option value="salary_min">Salary (Low to High)</option>
            <option value="salary_max">Salary (High to Low)</option>
            <option value="title">Title</option>
            <option value="company">Company</option>
          </Select>
        </Box>

        <Button colorScheme="blue" variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchFilters;
